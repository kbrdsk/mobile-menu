import "./style.css";

Array.from(document.getElementsByClassName("collapsing-menu")).map((menu) =>
	buildMenu(menu)
);

function buildMenu(menu) {
	menu.displayedItems = Array.from(menu.getElementsByClassName("menu-item"));
	menu.moreTab = buildMoreTab();
	menu.displayedItems.map((item) => {
		item.addEventListener("transitionend", () =>
			dropDownCascade(item, menu.moreTab)
		);
	});
	menu.appendChild(menu.moreTab);
	const resizeObserver = new ResizeObserver(() => moveMenuItems(menu));
	resizeObserver.observe(menu);
}

function moveMenuItems(menu) {
	const menuWidth = menu.getBoundingClientRect().width;
	let activeMenuItemWidth = menu.displayedItems.reduce(
		(totalWidth, menuItem) => {
			return totalWidth + menuItem.getBoundingClientRect().width;
		},
		menu.moreTab.getBoundingClientRect().width
	);
	while (activeMenuItemWidth > menuWidth && menu.displayedItems.length > 0) {
		const nextItem = menu.displayedItems.pop();
		activeMenuItemWidth -= nextItem.getBoundingClientRect().width;
		menu.moreTab.items.unshift(nextItem);
		buildDropMenu(menu.moreTab.items, menu.moreTab);
	}
	while (
		menu.moreTab.items[0] &&
		activeMenuItemWidth +
			menu.moreTab.items[0].getBoundingClientRect().width <=
			menuWidth &&
		menu.moreTab.items.length > 0
	) {
		const nextItem = menu.moreTab.items.shift();
		activeMenuItemWidth += nextItem.getBoundingClientRect().width;
		menu.displayedItems.push(nextItem);
		menu.insertBefore(nextItem, menu.moreTab);
		buildDropMenu(menu.moreTab.items, menu.moreTab);
	}
}

function buildMoreTab() {
	const moreTab = document.createElement("div");
	moreTab.classList.add("more-tab");
	moreTab.items = [];
	moreTab.activator = buildDropActivator(moreTab);
	moreTab.appendChild(moreTab.activator);
	moreTab.menu = buildDropMenu(moreTab.items, moreTab);
	moreTab.appendChild(moreTab.menu);
	buildDropMenu(moreTab.items, moreTab);
	return moreTab;
}

function buildDropActivator(dropDown){
	const activator = document.createElement("div");
	activator.textContent = "More";
	activator.addEventListener("click", () => toggleDropdown(dropDown));
	activator.classList.add("menu-item");
	return activator;
}

function dropDownCascade(dropDownItem, dropDown) {
	const menuItems = dropDown.items;
	const index = menuItems.indexOf(dropDownItem);
	if (index > -1) {
		if (dropDown.expanded === true && menuItems[index + 1]) {
			menuItems[index + 1].setAttribute("displaying", true);
		}
		if (dropDown.expanded === false) {
			if (menuItems[index - 1])
				menuItems[index - 1].setAttribute("displaying", false);
			else dropDown.menu.setAttribute("displaying", false);
		}
	}
}

function buildDropMenu(menuItems, dropDown) {
	dropDown.expanded = false;
	const menu = dropDown.menu? dropDown.menu: document.createElement("div");
	menu.classList.add("drop-down-menu");
	menu.setAttribute("displaying", false);
	menuItems.map((item, index) => {
		item.setAttribute("displaying", false);
		menu.appendChild(item);
	});
	return menu;
}

function toggleDropdown(moreTab) {
	if (moreTab.expanded) collapseMenu(moreTab);
	else expandMenu(moreTab);
}

function expandMenu(dropDown) {
	dropDown.menu.setAttribute("displaying", true);
	dropDown.expanded = true;
	dropDown.items[0].setAttribute("displaying", true);
}

function collapseMenu(dropDown) {
	dropDown.expanded = false;
	let lastLoadedIndex = -1;
	dropDown.items.map((item) => {
		if (item.getAttribute("displaying") === "true") lastLoadedIndex++;
	});
	if (lastLoadedIndex > -1)
		dropDown.items[lastLoadedIndex].setAttribute("displaying", false);
}
