<script>
export default {
  props: ["title", "message"],
  created() {
    console.log(this.title, "criado");
  },
  methods: {
    closeModal() {
      this.$parent.modalConfim = false;
      this.$emit("cancel");
    },
    confirm() {
      this.$emit("confirm");
      this.closeModal();
    }
  }
};
</script>

<template>
  <b-modal id="ModalConfim" :active.sync="$parent.modalConfim.show">
    <div class="modal-body p-b-1">
      <h3 class="fn-s15 has-text-weight-bold tx-blue p-0">{{ title }}</h3>
      <p class="m-b-2">
        <span v-html="message" />
      </p>
      <div class="columns is-mobile">
        <div class="column is-half has-text-right">
          <b-button
            class="fn-s09 bg-grey"
            @click="closeModal"
          >
            Cancelar
          </b-button>
        </div>
        <div class="column is-half">
          <b-button
            class="fn-s09 bg-green"
            @click="confirm"
          >
            Ok
          </b-button>
        </div>
      </div>
    </div>
  </b-modal>
</template>
