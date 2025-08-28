import { defineComponent, ref } from "vue";
export default defineComponent({
    setup() {
        const message = ref("Noch nichts ausgeführt.");
        async function runHelloWorld() {
            const res = await fetch("http://localhost:5000/run-test", {
                method: "POST",
            });
            const data = await res.json();
            message.value = `Status: ${data.status}, Result: ${data.result}`;
        }
        return { message, runHelloWorld };
    },
});
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "p-6" },
});
__VLS_asFunctionalElement(__VLS_elements.h1, __VLS_elements.h1)({
    ...{ class: "text-2xl font-bold" },
});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.runHelloWorld) },
    ...{ class: "mt-4 px-4 py-2 bg-green-600 text-white rounded" },
});
// @ts-ignore
[runHelloWorld,];
__VLS_asFunctionalElement(__VLS_elements.pre, __VLS_elements.pre)({
    ...{ class: "mt-4 bg-gray-100 p-4 rounded" },
});
(__VLS_ctx.message);
// @ts-ignore
[message,];
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-green-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gray-100']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
var __VLS_dollars;
let __VLS_self;
