<template>
    <div>
        <div
            class="bell"
            :class="{ 'bell-active': hasUnreadNotification }"
            style="width: 24px; height: 24px;"
            @click="showNotification"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                ></path>
            </svg>
        </div>
        <div v-if="showPopup" class="popup">
            <div v-if="showNotifications" class="notifications">
                <p v-for="notification in notifications" :key="notification.text">
                    <span class="date">{{ formatDate(notification.add_date) }}</span>
                    <br>
                    <span class="text">{{ notification.text }}</span>
                </p>
            </div>

            <button @click="closePopup" class="close-button">Закрыть</button>
        </div>
    </div>
</template>

<script>
export default {
    name: "MpNotify",
    data() {
        return {
            showNotifications: true,
            showPopup: false,
            notifications: [],
            hasRecentNotifications: false,
            hasUnreadNotification: false,
        };
    },

    methods: {
        showNotification: function () {
            this.showPopup = true;
            // сохраняем дату самой последней новости из прочитанных
            const lastReadedNotificationDate = new Date(this.notifications[0].add_date);
            localStorage.setItem('lastReadedNotificationDate', lastReadedNotificationDate.toISOString());
            this.hasUnreadNotification = false;
            this.hasRecentNotifications = false;

        },
        closePopup() {
            this.showPopup = false;
        },
        formatDate(date) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(date).toLocaleDateString('ru-RU', options);
        },
    },
    async created() {
        let data = await this.$mp.ajax("mp-gateway", "get-last-notifies")
        if (data.error) {
            alert('Ошибка')
        } else {
            this.notifications = data.resp.notify
            const today = new Date();
            today.setDate(today.getDate() - 3); // вычисляем, есть ли новости за последние 3 дня
            const recentDate = today.toISOString().split('T')[0]; // Преобразуем в формат 'YYYY-MM-DD'
            this.hasRecentNotifications = this.notifications.some(notification => notification.add_date >= recentDate);

            // если дата последней прочитанной новости в LS меньше,чем дата последней полученной новости, или в LS ничего нет
            // (то есть пользователь не заходил в новости) и есть новости за последние 3 дня, показываем,что есть непрочитанные новости
            if (this.notifications.length > 0) {
                const lastNotificationDate = new Date(this.notifications[0].add_date);
                const storedDate = localStorage.getItem("lastReadedNotificationDate");
                if (storedDate) {
                    const storedNotificationDate = new Date(storedDate);
                    this.hasUnreadNotification = storedNotificationDate < lastNotificationDate
                }
                else {
                    this.hasUnreadNotification = this.hasRecentNotifications
                }

            }
        }
    },
}
</script>

<style scoped>
.bell, .bell-active{
    cursor: pointer;
    position: fixed;
    top: 90px;
    right: 100px;
    display: flex;
}
.bell-active{
    color: red;
}
.popup {
    position: fixed;
    top: 80px;
    right: 80px;
    width: 400px;
    height: 600px;
    border: 2px solid black;
    display: flex;
    flex-direction: column;
    padding: 5px;
}

.notifications {
    flex-grow: 1;
    overflow: auto;
}

.close-button {
    margin-top: auto;
    border: 1px solid black;
}

</style>