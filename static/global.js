console.log("IT’S ALIVE!");
const ARE_WE_HOME = document.documentElement.classList.contains("home");

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

let pages = [
  { url: "./", title: "Home" },
  { url: "projects", title: "Projects" },
  { url: "cv", title: "CV" },
  { url: "contact", title: "Contact" },
  // add the rest of your pages here
];
let nav = document.createElement("nav");
document.body.prepend(nav);
document.body.insertAdjacentHTML(
  "afterbegin",
  `
	<label class="color-scheme">
		Theme:
		<select name='themes' id='theme select'> 
			<option>Automatic</option>
            <option>Light</option>
            <option>Dark</option> 
		</select>
	</label>`
);

for (let p of pages) {
  let url = p.url;
  let title = p.title;
  url = !ARE_WE_HOME && !url.startsWith("http") ? "../" + url : url;

  // Create link and add it to nav
  let a = document.createElement("a");
  a.href = url;
  a.textContent = title;
  nav.append(a);
  if (a.host === location.host && a.pathname === location.pathname) {
    a.classList.add("current");
  }
  a.classList.toggle(
    "current",
    a.host === location.host && a.pathname === location.pathname
  );
}

console.log("are we home?", ARE_WE_HOME);

let select = document.querySelector("select");
// if color scheme in localstorage, set selector option to match
if ("colorScheme" in localStorage) {
  // set selector option
  select.value = localStorage.colorScheme;
  // set css color scheme rule
  document.documentElement.style.setProperty(
    "color-scheme",
    localStorage.colorScheme
  );
}
// this fires when you pick a color option
select.addEventListener("input", function (event) {
  console.log("color scheme changed to", event.target.value);
  document.documentElement.style.setProperty(
    "color-scheme",
    event.target.value
  );
  localStorage.colorScheme = event.target.value;
});
