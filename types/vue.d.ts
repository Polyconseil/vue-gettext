import Vue, { VueConfiguration } from 'vue/types/vue';

declare module 'vue/types/vue' {
	interface ILanguageComponent extends Vue {
		available: {
			[key: string]: string;
		};
		current: string;
	}

	interface Vue {
		$translations: object;
		$language: ILanguageComponent;
		$gettext: (msgid: string) => string;
		$pgettext: (context: string, msgid: string) => string;
		$ngettext: (msgid: string, plural: string, n: number) => string;
		$npgettext: (context: string, msgid: string, plural: string, n: number) => string;
		$gettextInterpolate: (msgid: string, context: object, disableHtmlEscaping?: boolean) => string;
	}

	interface VueConfiguration {
		language: string;
	}
}
