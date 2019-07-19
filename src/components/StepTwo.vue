<template>
  <div class="step-two-wrapper">
    <div class="step-two-inner">
      <div class="contact-block">
        <label for="name" class="contact-block__label">ФИО</label>
        <input type="text" id="name" class="contact-block__input" v-model="name" />
      </div>
      <div class="contact-block">
        <label for="email" class="contact-block__label">Email</label>
        <input type="text" id="email" class="contact-block__input" v-model="email" />
      </div>
      <div class="contact-block">
        <label for="phone" class="contact-block__label">Телефон</label>
        <input
          type="text"
          id="phone"
          class="contact-block__input"
          v-model="phone"
          v-mask="'+7 (###) ###-##-##'"
          placeholder="+7 ("
        />
      </div>
    </div>
    <div class="step-two-errors">
      <p v-for="err in errors">{{ err }}</p>
    </div>
    <div class="step-two-button">
      <button type="button" @click="sendForm">Отправить заявку</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: null,
      email: null,
      phone: null,
      errors: []
    };
  },
  methods: {
    sendForm() {
      this.errors = [];
      // валидируем ошибки
      if (!this.name) {
        this.errors.push('Введите ФИО')
      }
      if (!this.email) {
        this.errors.push('Введите Email')
      } else if (!this.validEmail(this.email)) {
        this.errors.push('Укажите корректный Email');
      }
      if (!this.phone) {
        this.errors.push('Введите телефон')
      } else if (!this.validPhone(this.phone)) {
        this.errors.push('Укажите корректный телефон');
      }
      // записываем корректуню информацию в объект и кидаём её в стор для дальнейшей отправки на сервер
      // вызываем метод отправки на сервер
      if (this.errors.length === 0) {
        const contacts = {
          name: this.name,
          email: this.email,
          phone: this.phone
        }
        this.$store.commit('setContacts', contacts);
        this.$store.dispatch('sendForm');
      }
    },
    validEmail: function (email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
    validPhone: function (phone) {
      var re = /^((7)+([0-9]){10})$/;
      var clearPhone = phone.replace(/\D/g, '');
      return re.test(clearPhone);
    },
  }
};
</script>

<style lang="scss" scoped>
.step-two-wrapper {
}
.step-two-inner {
  display: flex;
  justify-content: space-between;
  border-radius: 8px;
  border: 3px solid rgb(90, 90, 230);
  padding: 15px 20px;
  margin-bottom: 20px;
}
.contact-block {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 250px;
  &__label {
    margin-bottom: 5px;
    padding-left: 5px;
  }
  &__input {
    width: 100%;
    border-radius: 12px;
    outline: none;
    border: 1px solid rgb(168, 162, 162);
    padding: 6px 15px;
    &:focus {
      border-color: rgb(90, 90, 230);
      box-shadow: 0px 0px 2px 1px rgba(90, 90, 230, 0.62);
    }
  }
}
.step-two-button {
  button {
    padding: 10px 15px;
    outline: none;
    cursor: pointer;
    background-color: rgb(90, 90, 230);
    color: #fff;
    font-weight: 700;
    border: none;
    border-radius: 5px;
    min-width: 205px;
  }
}
.step-two-errors {
  font-weight: 300;
  font-style: italic;
  color: rgb(231, 20, 20);
}
@media screen and (max-width: 780px) {
  .step-two-inner {
    flex-direction: column;
  }
  .contact-block {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
}
@media screen and (max-width: 500px) {
  .contact-block {
    max-width: none;
  }
}
</style>
