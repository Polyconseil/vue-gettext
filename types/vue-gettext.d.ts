import Vue, { ComponentOptions, VueConstructor} from 'vue';

interface IVueGettextOptions {
	availableLanguages: {
		[key: string]: string;
	};
	defaultLanguage: string;
	languageVmMixin: ComponentOptions<Vue> | typeof Vue;
	muteLanguages: string[];
	silent: boolean;
	translations: object;
}

export class VueGettext {
	constructor(Vue: VueConstructor<Vue>, options?: IVueGettextOptions);
}

export function install(vue: typeof Vue): void;

declare const _default: {
	VueGettext: typeof VueGettext,
	install: typeof install,
};

export default _default;
