<template>
  <form
    class="authForm"
    @submit="submitForm"
    method="post"
  >
    <h1>Код подтверждения</h1>

    <p v-if="errors.length" class="errors">
      <b>Пожалуйста исправьте указанные ошибки:</b>
      <ul>
        <li v-for="error in errors" :key="error">{{ error }}</li>
      </ul>
    </p>

    <p>Для завершения регистрации введите в поле код подтверждения, который должен прийти вам в sms на телефон +{{ this.phone }}.</p>
    <p v-if="this.secondsLeft>0">Повторная отправка sms возможна через {{ this.secondsLeft }} секунд.</p>
    <p v-if="this.secondsLeft==0"><MazBtn size="sm" color="secondary" @click="sendSmsAgain">Выслать sms еще раз</MazBtn></p>

    <MazInput
      v-model="smsCode"
      label="Код подтверждения"
    />

    <MazBtn type="submit">Отправить</MazBtn>

  </form>
</template>

<script>
import 'maz-ui/css/main.css'
import MazInput from 'maz-ui/components/MazInput'
import MazBtn from 'maz-ui/components/MazBtn'
export default {
  name: 'RegisterSmsView',
  components: { MazInput, MazBtn },
  data () {
    // Если в localStorage не сохранен телефон пользователя - уходим с этой страницы - этот телефон должен на странице регистрации был быть установлен
    const registerPhoneNumber = localStorage.getItem('registerPhoneNumber')
    if (!registerPhoneNumber) this.$router.push('register')
    // Переменные
    return {
      errors: [],
      smsCode: null,
      phone: registerPhoneNumber,
      secondsLeft: 160
    }
  },
  created () {
    setInterval(() => {
      if (this.secondsLeft>0) this.secondsLeft--;
    }, 1000);
  },
  methods: {
    submitForm: function (e) {
      this.errors = [];

      if (!this.smsCode||!/^[0-9]{6}$/.test(this.smsCode)) {
        this.errors.push('Введите код подтверждения состоящий из 6 цифр.');
      }

      // Если смс код совпал - ставим пользоватлю jwt токен полученный от сервера
      if (!this.errors.length) {
        const resp = this.$mp.auth('register-sms', {phone: this.phone, sms: this.smsCode})
        if (resp.error) this.errors.push('Ошибка сервера: '+resp.error)
        else {
          this.$mp.setAccessToken(resp.response)
          localStorage.removeItem('registerPhoneNumber')
          this.$router.push('/')
        }
      }

      e.preventDefault();
    },
    sendSmsAgain: function() {
      this.secondsLeft=160;
      const resp = this.$mp.auth('register-sms-send-again', {phone: this.phone})
      if (resp.error) this.errors.push('Ошибка сервера: '+resp.error)
    }
  }
}
</script>