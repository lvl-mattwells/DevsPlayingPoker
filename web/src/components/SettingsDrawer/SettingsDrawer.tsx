import { IntlKey, useIntl } from "@/i18n";
import { createSignal, JSX, ParentComponent, Show } from "solid-js";
import Icon from "../Icon";
import { Dialog, DialogCloseTrigger, DrawerContent } from "../Dialog";

export interface SettingsDrawerActions {
	onSaveName?: (name: string) => void;
}

type SettingsDrawerProps = {
	isOpen: boolean;
	onClose: () => void;
} & SettingsDrawerActions;

const SettingsDrawer: ParentComponent<SettingsDrawerProps> = (props) => {
	const intl = useIntl();
	const [errorMsg, setErrorMsg] = createSignal<IntlKey | null>(null);

	const handleThemeChange: JSX.EventHandlerUnion<HTMLSelectElement, Event> = (
		e,
	) => {
		const selection = e.currentTarget.value;

		if (selection === "system") {
			localStorage.setItem("theme", "system");

			if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
				document.documentElement.classList.add("dark");
			} else {
				document.documentElement.classList.remove("dark");
			}
		} else if (selection === "light") {
			localStorage.setItem("theme", "light");
			document.documentElement.classList.remove("dark");
		} else if (selection === "dark") {
			localStorage.setItem("theme", "dark");
			document.documentElement.classList.add("dark");
		}
	};

	return (
		<Dialog isOpen={props.isOpen} onClose={props.onClose} role="dialog">
			<DrawerContent>
				<DialogCloseTrigger
					onClick={props.onClose}
					title={intl.t("closeSettingsDrawer") as string}
					class="btn-icon block ml-auto"
				>
					&#10005;
				</DialogCloseTrigger>
				<div class="form-control my-8">
					<label for="theme-select">{intl.t("theme")}</label>
					<select
						id="theme-select"
						name="theme-select"
						aria-describedby="theme-select-helptext"
						value={localStorage.getItem("theme") ?? "system"}
						onChange={handleThemeChange}
					>
						<option value="system">{intl.t("system")}</option>
						<option value="light">{intl.t("light")}</option>
						<option value="dark">{intl.t("dark")}</option>
					</select>
					<p id="theme-select-helptext" class="text-sm">
						{intl.t("savesAutomatically")}
					</p>
				</div>
				<Show when={props.onSaveName}>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							const formData = new FormData(e.currentTarget);
							const name = formData.get("name")?.toString().trim();

							if (!name || name.length === 0) {
								setErrorMsg("enterAName");
								return;
							}
							if (name.length > 20) {
								setErrorMsg("nameTooLong");
								return;
							}

							props.onSaveName!(name);
						}}
						class="form-control"
					>
						<label for="name" class="label">
							{intl.t("name")}
						</label>
						<div class="flex w-full">
							<input
								id="name"
								name="name"
								type="text"
								required
								minLength="1"
								maxLength="20"
								autofocus
								value={localStorage.getItem("name") ?? ""}
								onInput={() => setErrorMsg(null)}
								aria-describedby="name-error-msg"
								aria-invalid={Boolean(errorMsg())}
								class="border-r-0 rounded-r-none flex-1"
							/>
							<button
								type="submit"
								title={intl.t("saveName") as string}
								class="btn rounded-l-none p-2.5"
							>
								<Icon
									name="save"
									aria-label={intl.t("saveName") as string}
									fill="none"
									class="w-6 h-6"
								/>
							</button>
						</div>
						<Show when={errorMsg()}>
							{(msg) => (
								<p id="name-error-msg" class="text-red">
									{intl.t(msg())}
								</p>
							)}
						</Show>
					</form>
				</Show>
			</DrawerContent>
		</Dialog>
	);
};

export default SettingsDrawer;
