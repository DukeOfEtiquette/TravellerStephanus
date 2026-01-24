import { $ as store_get, _ as attr, a0 as ensure_array_like, a2 as unsubscribe_stores } from "../../../../chunks/index.js";
import { g as getContext, e as escape_html } from "../../../../chunks/context.js";
import "clsx";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/state.svelte.js";
import { c as characters } from "../../../../chunks/characters.js";
const getStores = () => {
  const stores$1 = getContext("__svelte__");
  return {
    /** @type {typeof page} */
    page: {
      subscribe: stores$1.page.subscribe
    },
    /** @type {typeof navigating} */
    navigating: {
      subscribe: stores$1.navigating.subscribe
    },
    /** @type {typeof updated} */
    updated: stores$1.updated
  };
};
const page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let character = store_get($$store_subs ??= {}, "$characters", characters).find((c) => c.id === store_get($$store_subs ??= {}, "$page", page).params.id);
    function handleBackgroundChange(field, value) {
      if (!character) return;
      characters.update(character.id, { background: { ...character.background, [field]: value } });
    }
    function updateCareer(index, field, value) {
      if (!character) return;
      const updated = character.careers.map((c, i) => i === index ? { ...c, [field]: value } : c);
      characters.update(character.id, { careers: updated });
    }
    if (!character) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="bg-gray-800 rounded-lg p-8 text-center"><p class="text-gray-400 mb-4">Character not found.</p> <a href="/" class="text-amber-400 hover:text-amber-300">Back to Characters</a></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="space-y-6"><div class="flex items-center justify-between"><h1 class="text-2xl font-bold text-amber-400">${escape_html(character.name || "Unnamed Character")}</h1> <a href="/" class="text-gray-400 hover:text-white">Back to List</a></div> <div class="bg-gray-800 rounded-lg p-6 space-y-6"><section><h2 class="text-lg font-semibold text-amber-400 mb-3">Basic Info</h2> <div class="grid grid-cols-2 gap-4"><div><label class="block text-sm text-gray-400 mb-1">Name</label> <input type="text"${attr("value", character.name)} class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"/></div> <div><label class="block text-sm text-gray-400 mb-1">Age</label> <input type="number"${attr("value", character.background.age)} class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"/></div> <div><label class="block text-sm text-gray-400 mb-1">Homeworld</label> `);
      $$renderer2.select(
        {
          value: character.background.homeworld,
          onchange: (e) => handleBackgroundChange("homeworld", e.currentTarget.value),
          class: "w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
        },
        ($$renderer3) => {
          $$renderer3.option({ value: "" }, ($$renderer4) => {
            $$renderer4.push(`Select...`);
          });
          $$renderer3.option({ value: "Agricultural" }, ($$renderer4) => {
            $$renderer4.push(`Agricultural`);
          });
          $$renderer3.option({ value: "Fringe" }, ($$renderer4) => {
            $$renderer4.push(`Fringe`);
          });
          $$renderer3.option({ value: "Spacer" }, ($$renderer4) => {
            $$renderer4.push(`Spacer`);
          });
          $$renderer3.option({ value: "Industrial" }, ($$renderer4) => {
            $$renderer4.push(`Industrial`);
          });
          $$renderer3.option({ value: "High Culture" }, ($$renderer4) => {
            $$renderer4.push(`High Culture`);
          });
        }
      );
      $$renderer2.push(`</div> <div><label class="block text-sm text-gray-400 mb-1">Schooling</label> `);
      $$renderer2.select(
        {
          value: character.background.schooling,
          onchange: (e) => handleBackgroundChange("schooling", e.currentTarget.value),
          class: "w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
        },
        ($$renderer3) => {
          $$renderer3.option({ value: "" }, ($$renderer4) => {
            $$renderer4.push(`Select...`);
          });
          $$renderer3.option({ value: "The Streets" }, ($$renderer4) => {
            $$renderer4.push(`The Streets`);
          });
          $$renderer3.option({ value: "Apprenticeship" }, ($$renderer4) => {
            $$renderer4.push(`Apprenticeship`);
          });
          $$renderer3.option({ value: "Military Academy" }, ($$renderer4) => {
            $$renderer4.push(`Military Academy`);
          });
          $$renderer3.option({ value: "University" }, ($$renderer4) => {
            $$renderer4.push(`University`);
          });
          $$renderer3.option({ value: "Finishing School" }, ($$renderer4) => {
            $$renderer4.push(`Finishing School`);
          });
        }
      );
      $$renderer2.push(`</div></div></section> <section><h2 class="text-lg font-semibold text-amber-400 mb-3">Attributes</h2> <div class="grid grid-cols-3 sm:grid-cols-6 gap-4"><!--[-->`);
      const each_array = ensure_array_like(["STR", "DEX", "END", "INT", "EDU", "SOC"]);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let attr$1 = each_array[$$index];
        $$renderer2.push(`<div><label class="block text-sm text-gray-400 mb-1 text-center">${escape_html(attr$1)}</label> <input type="number" min="2" max="12"${attr("value", character.attributes[attr$1])} class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-center"/></div>`);
      }
      $$renderer2.push(`<!--]--></div> `);
      if (character.attributes.PSI !== void 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="mt-4 w-24"><label class="block text-sm text-gray-400 mb-1 text-center">PSI</label> <input type="number" min="0" max="12"${attr("value", character.attributes.PSI)} class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-center"/></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></section> <section><h2 class="text-lg font-semibold text-amber-400 mb-3">Hit Protection</h2> <div class="grid grid-cols-2 sm:grid-cols-4 gap-4"><div><label class="block text-sm text-gray-400 mb-1">Total</label> <input type="number"${attr("value", character.hitProtection.total)} class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"/></div> <div><label class="block text-sm text-gray-400 mb-1">Current</label> <input type="number"${attr("value", character.hitProtection.current)} class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"/></div> <div><label class="block text-sm text-gray-400 mb-1">Bloodied</label> <input type="number"${attr("value", character.hitProtection.bloodied)} class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"/></div> <div><label class="block text-sm text-gray-400 mb-1">Armor</label> <input type="text"${attr("value", character.hitProtection.armor)} class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"/></div></div></section> <section><div class="flex items-center justify-between mb-3"><h2 class="text-lg font-semibold text-amber-400">Careers</h2> <button class="text-sm bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded">Add Career</button></div> `);
      if (character.careers.length === 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p class="text-gray-500 text-sm">No careers added yet.</p>`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="space-y-3"><!--[-->`);
        const each_array_1 = ensure_array_like(character.careers);
        for (let index = 0, $$length = each_array_1.length; index < $$length; index++) {
          let career = each_array_1[index];
          $$renderer2.push(`<div class="flex items-center gap-3 bg-gray-700/50 p-3 rounded"><div class="flex-1"><label class="block text-xs text-gray-400 mb-1">Career</label> `);
          $$renderer2.select(
            {
              value: career.name,
              onchange: (e) => updateCareer(index, "name", e.currentTarget.value),
              class: "w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm"
            },
            ($$renderer3) => {
              $$renderer3.option({ value: "" }, ($$renderer4) => {
                $$renderer4.push(`Select...`);
              });
              $$renderer3.option({ value: "Military" }, ($$renderer4) => {
                $$renderer4.push(`Military`);
              });
              $$renderer3.option({ value: "Mercantile" }, ($$renderer4) => {
                $$renderer4.push(`Mercantile`);
              });
              $$renderer3.option({ value: "Frontier" }, ($$renderer4) => {
                $$renderer4.push(`Frontier`);
              });
              $$renderer3.option({ value: "Noble" }, ($$renderer4) => {
                $$renderer4.push(`Noble`);
              });
              $$renderer3.option({ value: "Drifter" }, ($$renderer4) => {
                $$renderer4.push(`Drifter`);
              });
              $$renderer3.option({ value: "Psion" }, ($$renderer4) => {
                $$renderer4.push(`Psion`);
              });
            }
          );
          $$renderer2.push(`</div> <div class="w-20"><label class="block text-xs text-gray-400 mb-1">Terms</label> <input type="number" min="1"${attr("value", career.terms)} class="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm text-center"/></div> <div class="w-20"><label class="block text-xs text-gray-400 mb-1">Rank</label> <input type="number" min="0"${attr("value", career.rank)} class="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm text-center"/></div> <button class="text-red-400 hover:text-red-300 p-1 mt-4" title="Remove career"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg></button></div>`);
        }
        $$renderer2.push(`<!--]--></div>`);
      }
      $$renderer2.push(`<!--]--></section> <section><div class="flex items-center justify-between mb-3"><h2 class="text-lg font-semibold text-amber-400">Expertise</h2> <button class="text-sm bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded">Add Skill</button></div> `);
      if (character.expertise.length === 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p class="text-gray-500 text-sm">No skills added yet.</p>`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-3"><!--[-->`);
        const each_array_2 = ensure_array_like(character.expertise);
        for (let index = 0, $$length = each_array_2.length; index < $$length; index++) {
          let skill = each_array_2[index];
          $$renderer2.push(`<div class="flex items-center gap-3 bg-gray-700/50 p-3 rounded"><div class="flex-1"><label class="block text-xs text-gray-400 mb-1">Skill</label> <input type="text"${attr("value", skill.name)} placeholder="Skill name" class="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm"/></div> <div class="w-16"><label class="block text-xs text-gray-400 mb-1">Rank</label> <input type="number" min="1" max="3"${attr("value", skill.rank)} class="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm text-center"/></div> <button class="text-red-400 hover:text-red-300 p-1 mt-4" title="Remove skill"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg></button></div>`);
        }
        $$renderer2.push(`<!--]--></div>`);
      }
      $$renderer2.push(`<!--]--></section> <section><h2 class="text-lg font-semibold text-amber-400 mb-3">Equipment</h2> <div class="grid grid-cols-2 gap-4"><div><label class="block text-sm text-gray-400 mb-1">Cash (Cr)</label> <input type="number"${attr("value", character.equipment.cash)} class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"/></div> <div><label class="block text-sm text-gray-400 mb-1">Weekly Stipend (Cr)</label> <input type="number"${attr("value", character.equipment.stipend)} class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"/></div></div> <div class="mt-4"><label class="block text-sm text-gray-400 mb-1">Weapons (one per line)</label> <textarea class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white h-20">`);
      const $$body = escape_html(character.equipment.weapons.join("\n"));
      if ($$body) {
        $$renderer2.push(`${$$body}`);
      }
      $$renderer2.push(`</textarea></div> <div class="mt-4"><label class="block text-sm text-gray-400 mb-1">Gear (one per line)</label> <textarea class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white h-20">`);
      const $$body_1 = escape_html(character.equipment.gear.join("\n"));
      if ($$body_1) {
        $$renderer2.push(`${$$body_1}`);
      }
      $$renderer2.push(`</textarea></div> <div class="mt-4"><label class="block text-sm text-gray-400 mb-1">Vehicles (one per line)</label> <textarea class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white h-20">`);
      const $$body_2 = escape_html(character.equipment.vehicles.join("\n"));
      if ($$body_2) {
        $$renderer2.push(`${$$body_2}`);
      }
      $$renderer2.push(`</textarea></div></section> <section><h2 class="text-lg font-semibold text-amber-400 mb-3">Notes</h2> <textarea class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white h-32" placeholder="Character notes, backstory, etc.">`);
      const $$body_3 = escape_html(character.notes);
      if ($$body_3) {
        $$renderer2.push(`${$$body_3}`);
      }
      $$renderer2.push(`</textarea></section></div></div>`);
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
