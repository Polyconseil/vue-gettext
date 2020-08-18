<template>
  <p>
    {{ dateFormat(dateNow) }}
  </p>
</template>

<script>
import { useGettext } from "/@gettext/";
import { format, subDays } from "date-fns";
import en from "date-fns/locale/en-US";
import fr from "date-fns/locale/fr";
import it from "date-fns/locale/it";

export default {
  data: () => ({
    dateNow: new Date(),
  }),
  methods: {
    dateFormat: (value, formatString) => {
      const gettext = useGettext();
      const locales = { en, fr, it };
      // INFO: using the currentWithoutRegion mixin
      const locale = locales[gettext.currentWithoutRegion];
      return format(value, formatString ? formatString : "EEEE d LLLL HH:mm:ss", { locale });
    },
  },
};
</script>
