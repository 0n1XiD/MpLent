<template>
    <div class="settings">
        <div class="path">
<!--            <label>{{ label }}</label>-->
<!--            <div>{{ "путь, по которому находится пользователь" }}</div>-->
        </div>
<!--        <div class="reports">-->
<!--            <button @click="handleButtonClick">товары</button>-->
<!--            <button @click="handleButtonClick">подкатегории</button>-->
<!--            <button @click="handleButtonClick">продавцы</button>-->
<!--            <button @click="handleButtonClick">бренды</button>-->
<!--        </div>-->
        <!--            <button @click="handleButtonClick">FBS</button>-->
        <!--            <button @click="handleButtonClick">FBO</button>-->
        <div class="table-settings">
            <p>Период:</p>
            <select v-model="selectedPeriod" @change="handlePeriodChange">
                <option value="3">За 3 дня</option>
                <option value="7">За 7 дней</option>
                <option value="30">За 30 дней</option>
                <option value="90">За 90 дней</option>
                <option value="custom">Выбрать период</option>
            </select>
            <div v-if="selectedPeriod === 'custom'">
                <p>с </p>
                <input type="date" v-model="startDate" @input="handleStartDateInput">
                <p>по</p>
                <input type="date" v-model="endDate" @input="handleEndDateInput">
            </div>
            <p>{{ formatStartDate }} - {{ formatEndDate }}</p>
            <button @click="emitDateChange">Поиск</button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MpDateSettings',
    props: {
        label: {
            type: String,
            required: true,
        },
    },
    data() {
        const localStorageKey = `selectedPeriod-${this.$route.name}`;
        const endDate = new Date(); // по умолчанию сегодняшняя дата
        let selectedPeriod = localStorage.getItem(localStorageKey) || '30'; // выбранный период
        selectedPeriod = parseInt(selectedPeriod);
        const startDate = new Date(endDate - selectedPeriod * 24 * 60 * 60 * 1000);
        return {
            startDate: startDate,
            endDate: endDate,
            selectedPeriod: selectedPeriod.toString(),
        };
    },
    computed: {
        formatStartDate() {
            if (this.startDate) {
                return this.formatDate(this.startDate);
            }
            return '';
        },
        formatEndDate() {
            if (this.endDate) {
                return this.formatDate(this.endDate);
            }
            return '';
        },
    },
    methods: {
        handlePeriodChange() {
            const localStorageKey = `selectedPeriod-${this.$route.name}`;
            if (this.selectedPeriod !== 'custom') {
                const pastDate = new Date(this.endDate);
                pastDate.setDate(pastDate.getDate() - parseInt(this.selectedPeriod));
                this.startDate = pastDate;
                localStorage.setItem(localStorageKey, this.selectedPeriod);
            } else {
                localStorage.removeItem(localStorageKey);
            }
        },
        handleStartDateInput(event) {
            this.startDate = new Date(event.target.value);
        },

        handleEndDateInput(event) {
            this.endDate = new Date(event.target.value);
        },
        emitDateChange() {
            if (this.startDate && this.endDate) {
                this.$emit('date-changed', this.startDate, this.endDate);
            }
        },
        formatDate(date) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return date.toLocaleDateString('ru-RU', options);
        },
    },
};
</script>

<style scoped>
.settings {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.path {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-top: 10px; /* Добавить отступ снизу */
}

.path label {
    margin-right: 10px;
}

.reports {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-top: 10px; /* Добавить отступ снизу */
}

.table-settings {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-top: 10px; /* Добавить отступ снизу */
}
</style>






