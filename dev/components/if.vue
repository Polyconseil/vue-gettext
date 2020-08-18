<template>
  <div>
    <p>
      <button @click="toggleShow()">Toggle: {{ show }}</button>
      <translate v-if="show">Welcome %{ obj.name }</translate>
    </p>

    <div>
      <p>
        <button @click="setName1()">1</button>
        <button @click="setName2()">2</button>
        <button @click="setName3()">3</button>
        [{{ obj.name }}]
      </p>
      <p v-if="obj.name === 'Group1'" v-translate="obj.name">This is %{ obj.name }</p>
      <p v-if="obj.name === 'Group2'" v-translate="obj.name">This is %{ obj.name }</p>
      <p v-if="obj.name === 'Group3'" v-translate="obj.name">This is %{ obj.name }</p>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    show: true,
    obj: {
      name: "Group1",
    },
  }),
  methods: {
    toggleShow() {
      this.show = !this.show;
    },
    setName1() {
      this.obj.name = "Group1";
    },
    setName2() {
      this.obj.name = "Group2";
    },
    setName3() {
      this.obj.name = "Group3";
    },
  },
};
</script>
