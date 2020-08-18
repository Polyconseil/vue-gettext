<template>
  <div>
    <p :class="$style.title">
      <translate>In English, '0' (zero) is always plural.</translate>
    </p>
    <p>
      <button @click="decrease()">-</button>
      {{ n }}
      <button @click="increase()">+</button>
    </p>
    <p>
      data:
      <translate :translate-n="n" translate-plural="%{ n } books">%{ n } book</translate>
    </p>
    <p>
      computed:
      <translate :translate-n="nComputed" translate-plural="%{ nComputed } books">
        %{ nComputed } book
      </translate>
    </p>

    <p :class="$style.title">
      <translate>
        Use default singular or plural form when there is no translation. This is left untranslated on purpose.
      </translate>
    </p>
    <p>
      <translate
        :translate-n="countForUntranslated"
        translate-plural="%{ countForUntranslated } items. This is left untranslated on purpose."
      >
        %{ countForUntranslated } item. This is left untranslated on purpose.
      </translate>
    </p>
  </div>
</template>

<script>
export default {
  created: function() {
    // this.styles = styles;
  },
  data: () => ({
    n: 0,
    countForUntranslated: 10,
  }),
  computed: {
    nComputed() {
      return this.n;
    },
  },
  methods: {
    decrease() {
      if (this.n === 0) return;
      this.n -= 1;
    },
    increase() {
      this.n += 1;
    },
  },
};
</script>

<style module>
@import "../variables.css";

.title {
  color: var(--color-blue);
}
</style>
