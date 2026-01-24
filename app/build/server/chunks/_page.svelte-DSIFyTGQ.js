import { a8 as store_get, a9 as ensure_array_like, a7 as attr, aa as stringify, ab as unsubscribe_stores } from './index-D6cWvoEc.js';
import { q as escape_html } from './exports-Pg4O_axc.js';
import './state.svelte-4LdB0cfH.js';
import { c as characters } from './characters-N2NhcN39.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    $$renderer2.push(`<input type="file" accept=".json" class="hidden"/> <div class="space-y-6"><div class="flex items-center justify-between"><h1 class="text-2xl font-bold text-amber-400">Your Characters</h1> <div class="flex gap-2"><button class="text-sm bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded">Import</button> `);
    if (store_get($$store_subs ??= {}, "$characters", characters).length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<button class="text-sm bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded">Export</button>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div></div> `);
    if (store_get($$store_subs ??= {}, "$characters", characters).length === 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="bg-gray-800 rounded-lg p-8 text-center"><p class="text-gray-400 mb-4">No characters yet.</p> <button class="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded">Create Your First Character</button></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="grid gap-4"><!--[-->`);
      const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$characters", characters));
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let character = each_array[$$index];
        $$renderer2.push(`<div class="bg-gray-800 rounded-lg p-4 flex items-center justify-between"><div><h2 class="text-lg font-semibold text-white">${escape_html(character.name || "Unnamed Character")}</h2> <p class="text-sm text-gray-400">`);
        if (character.careers.length > 0) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`${escape_html(character.careers.map((c) => c.name).join(", "))}`);
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`No career`);
        }
        $$renderer2.push(`<!--]--> • Age ${escape_html(character.background.age)}</p></div> <div class="flex gap-2"><a${attr("href", `/character/${stringify(character.id)}`)} class="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm">Edit</a> <button class="bg-red-900 hover:bg-red-800 text-white px-3 py-1 rounded text-sm">Delete</button></div></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-DSIFyTGQ.js.map
