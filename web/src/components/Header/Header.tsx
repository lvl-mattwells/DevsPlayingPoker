import { useIntl } from "@/i18n";
import mergeClassNames from "@/utils/mergeClassNames";
import { Link, useLocation } from "solid-app-router";
import { createSignal, ParentComponent, Show, splitProps } from "solid-js";
import Icon from "../Icon";
import SettingsDrawer, { SettingsDrawerActions } from "../SettingsDrawer";

interface HeaderProps extends SettingsDrawerActions {
	class?: string;
}

const Header: ParentComponent<HeaderProps> = (props) => {
	const intl = useIntl();
	const location = useLocation();
	const [drawerOpen, setDrawerOpen] = createSignal<boolean>(false);
	const [componentProps, actions] = splitProps(props, ["class", "children"]);

	return (
		<>
			<header class={mergeClassNames("navbar p-0 min-h-0", props.class)}>
				<div class="navbar-start">
					<Show when={location.pathname !== "/"}>
						<Link href="/">
							<span aria-hidden="true" class="mr-1">
								🏠
							</span>
							{intl.t("home")}
						</Link>
					</Show>
				</div>
				<div class="navbar-center">{componentProps.children}</div>
				<div class="navbar-end">
					<a
						href="https://github.com/lvl-mattwells/DevsPlayingPoker"
						target="_blank"
						class="btn btn-ghost btn-square"
						title={intl.t("viewGithub") as string}
					>
						<Icon
							name="github"
							boxSize="24"
							fill="currentColor"
							aria-label={intl.t("viewGithub") as string}
						/>
					</a>
					<button
						type="button"
						onClick={[setDrawerOpen, true]}
						title={intl.t("openSettingsDrawer") as string}
						class="btn btn-ghost btn-square"
					>
						<Icon
							name="user-solid"
							aria-label={intl.t("openSettingsDrawer") as string}
							boxSize="24"
						/>
					</button>
				</div>
			</header>
			<SettingsDrawer
				isOpen={drawerOpen()}
				onClose={() => setDrawerOpen(false)}
				{...actions}
			/>
		</>
	);
};

export default Header;
