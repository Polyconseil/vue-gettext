<template>
  <language-select></language-select>

  <hr />

  <h2><code>[Alert]</code></h2>
  <Alert></Alert>

  <hr />

  <h2><code>[Plural]</code></h2>
  <Plural></Plural>

  <hr />

  <h2><code>[Filter]</code></h2>
  <DateFormat></DateFormat>

  <hr />

  <h2><code>[Custom tags]</code></h2>
  <CustomTags></CustomTags>

  <hr />

  <h2><code>[Multilines]</code></h2>
  <Multilines></Multilines>

  <hr />

  <h2><code>[Directive]</code></h2>
  <Directive></Directive>

  <hr />

  <h2><code>[If]</code></h2>
  <If></If>
</template>

<script>
import Alert from "./components/alert.vue";
import CustomTags from "./components/customTags.vue";
import Directive from "./components/directive.vue";
import If from "./components/if.vue";
import LanguageSelect from "./components/languageSelect.vue";
import DateFormat from "./components/dateFormat.vue";
import Multilines from "./components/multilines.vue";
import Plural from "./components/plural.vue";

export default {
  name: "App",
  components: {
    Alert,
    CustomTags,
    Directive,
    If,
    LanguageSelect,
    DateFormat,
    Multilines,
    Plural,
  },
};
</script>
