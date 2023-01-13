import { Component, createEffect } from "solid-js";
import { useRoom } from "../../../RoomContext";
import zod from "zod";
import styles from "../VotingDescription.module.scss";
import Button from "@/components/Button";
import { useIntl } from "@/i18n";

const votingDescSchema = zod
	.string()
	.trim()
	.max(300)
	.refine((val) => val.split("\n").length - 1 < 6);

const EditDescription: Component<{ onStopEditing: () => void }> = (props) => {
	const intl = useIntl();
	const room = useRoom();
	let textareaRef: HTMLTextAreaElement | null = null;

	createEffect(() => {
		if (textareaRef) {
			textareaRef.focus();
			textareaRef.setSelectionRange(0, -1);
		}
	});

	return (
		<form
			class={styles.editForm}
			onSubmit={(e) => {
				e.preventDefault();
				const formData = new FormData(e.currentTarget);
				const votingDesc = formData.get("votingDesc")?.toString();
				const schemaCheck = votingDescSchema.safeParse(votingDesc);

				if (schemaCheck.success) {
					if (schemaCheck.data !== room.roomData.votingDescription) {
						room.dispatchEvent({
							event: "UpdateVotingDescription",
							value: schemaCheck.data,
						});
					}
					props.onStopEditing();
				}
			}}
		>
			<label for="votingDesc">{intl.t("votingDesc")}</label>
			<textarea
				id="votingDesc"
				name="votingDesc"
				rows="3"
				maxLength="300"
				autofocus
				ref={(el) => (textareaRef = el)}
				aria-describedby="votingDesc-helper-text"
			>
				{room.roomData.votingDescription}
			</textarea>
			<p class={styles.helpText} id="votingDesc-helper-text">
				{intl.t("votingDescHelperText")}
			</p>
			<div role="group" class={styles.btnGroup}>
				<Button type="submit">{intl.t("update")}</Button>
				<Button type="button" variant="outline" onClick={props.onStopEditing}>
					{intl.t("cancel")}
				</Button>
			</div>
		</form>
	);
};

export default EditDescription;
