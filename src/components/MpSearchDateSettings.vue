<template>
    <div class="settings">
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

            <input type="text" v-model="keyWord" placeholder="Поиска товаров по ключевому слову">
            <button @click="emitSearchProducts">Поиск </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MpSearchDateSettings',
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
            keyWord: '', // новое свойство для хранения ключевого слова
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
        emitSearchProducts() {
            if (this.startDate && this.endDate && this.keyWord) {
                this.$emit('search-products', {
                    startDate: this.startDate,
                    endDate: this.endDate,
                    keyWord: this.keyWord
                });
            }
        },
        emitDateChange() {
            if (this.startDate && this.endDate && this.keyWord) {
                this.$emit('date-changed', this.startDate, this.endDate, this.keyWord);
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






