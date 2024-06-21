<template>

    <div>
        <h1>Личный кабинет</h1>
        <div v-if="userNotFound" >{{ userNotFoundError }}</div>
        <div v-if="userInfo">

            <MpNotify></MpNotify>
        <div>
            <label>Имя: </label>
            <span class="button-margin" v-if="!editMode.name">{{ user.name }}</span>
            <MazInput v-else v-model="user.name" required />
            <MazBtn v-if="!editMode.name" @click="toggleEditMode('name')"> Изменить </MazBtn>
            <MazBtn v-else @click="updateUser('name')" :disabled="!validateName()"> Сохранить </MazBtn>
            <div v-if="editMode.name && !validateName()">Введите имя</div>
        </div>
        <br>
        <div>
            <label>Телефон: </label>
            <span class="button-margin"  v-if="!editMode.phone">{{ user.phone }}</span>
            <MazInput v-else v-model="user.phone" required />
            <MazBtn v-if="!editMode.phone" @click="toggleEditMode('phone')"> Изменить </MazBtn>
            <MazBtn v-else @click="updateUser('phone')" :disabled="!validatePhone()"> Сохранить </MazBtn>
            <div v-if="editMode.phone && !validatePhone()">Введите корректный телефон</div>
        </div>
        <br>
        <div>
            <label>Электронная почта: </label>
            <span class="button-margin"  v-if="!editMode.email">{{ user.email }}</span>
            <MazInput v-else v-model="user.email" required />
            <MazBtn v-if="!editMode.email" @click="toggleEditMode('email')"> Изменить </MazBtn>
            <MazBtn v-else @click="updateUser('email')" :disabled="!validateEmail()"> Сохранить </MazBtn>
            <div v-if="editMode.email && !validateEmail()">Введите корректный адрес электронной почты</div>
        </div>
        <br>

        <MazBtn @click="toggleChangePasswordFields">Сменить пароль</MazBtn>

        <div v-if="showChangePasswordFields">
            <div>
                <label>Старый пароль:</label>
                <MazInput v-model="oldPassword" type="password" required />
            </div>
            <div>
                <label>Новый пароль:</label>
                <MazInput v-model="newPassword" type="password" required />
                <div class="error-message" v-if="newPasswordError">{{ newPasswordErrorMessage }}</div>
            </div>
            <MazBtn @click="changePassword" :disabled="!isPasswordsValid">Сменить пароль</MazBtn>
        </div>
        <br>
        <div class="res-message" @click="changePassRes=false">{{ passResMessage }}</div>
    </div>
    </div>
</template>


<script>
import 'maz-ui/css/main.css'
import MazInput from 'maz-ui/components/MazInput'
import MazBtn from 'maz-ui/components/MazBtn'
import MpNotify from "@/components/MpNotify.vue";
export default {
    components: {MpNotify, MazInput, MazBtn },
    data() {
        return {
            user: {
                name: '',
                phone: '',
                email: ''
            },
            editMode: {
                name: false,
                phone: false,
                email: false
            },
            oldPassword: '',
            newPassword: '',
            newPasswordError: false,
            newPasswordErrorMessage: '',
            showChangePasswordFields: false,
            changePassRes: false,
            passResMessage: '',
            userNotFound: false,
            userNotFoundError:'',
            userInfo:false,
        }
    },
    computed: {
        isPasswordsValid() {
            return this.oldPassword && this.newPassword;
        }
        },
    methods: {
        isValidEmail(email) {
            const emailPattern = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
            return emailPattern.test(email);
        },
        validateName() {
            return this.editMode.name ? this.user.name.trim().length > 0 : true;
        },
        validatePhone() {
            if (this.editMode.phone) {
                this.user.phone = this.user.phone.replace(/\D/g, '');
                return this.user.phone.length === 11;
            }
            return true;
        },
        validateEmail() {
            return this.editMode.email ? this.isValidEmail(this.user.email) : true;
        },
        toggleEditMode(field) {
            this.editMode[field] = !this.editMode[field];
        },
        updateUser(field) {
            // Обработчик события сохранения изменений пользователя
            let data = this.$mp.ajax("mp-gateway", "update-user-account-info", {field: field, value: this.user[field]})
            if (data.error) {
                alert('Ошибка')}

            this.toggleEditMode(field);
        },
        toggleChangePasswordFields() {
            this.showChangePasswordFields = !this.showChangePasswordFields;
        },
        changePassword: async function () {
            // Обработчик события смены пароля
            if (!this.oldPassword || !this.newPassword) {
                return;
            }

            // Валидация нового пароля
            if (!/^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9]{7,}$/.test(this.newPassword)) {
                this.newPasswordError = true;
                this.newPasswordErrorMessage = 'Пароль должен быть не меньше 6 символов. В нем обязательно должны быть английские буквы в верхнем и нижнем регистре и цифры.';
                return;
            }

            // Отправка запроса на смену пароля
            const data = await this.$mp.ajax("mp-gateway", "change-password", {
                oldPassword: this.oldPassword,
                newPassword: this.newPassword
            })
            if (data.error) {
                alert('Ошибка при смене пароля');
            } else {
                this.changePassRes = true;
                this.passResMessage = data.resp.res
                // Сброс полей старого и нового пароля после успешной смены
                this.oldPassword = '';
                this.newPassword = '';
                // Скрытие полей снова после успешной смены
                this.showChangePasswordFields = false;
            }
        }
    },
    async created() {
        let data = await this.$mp.ajax("mp-gateway", "get-user-account-info")
        if (data.error) {
            alert('Ошибка');
        } else if (data.resp.error) {
            this.userNotFoundError = data.resp.error
            this.userNotFound = true
        } else {
            this.user.name = data.resp.name
            this.user.email = data.resp.email
            this.user.phone = data.resp.phone
            this.userInfo = true
        }
    }
}
</script>

<style>
.button-margin {
    margin-right: 20px;
}
</style>