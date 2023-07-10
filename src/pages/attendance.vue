<template>
  <div class="attendance-container">
    <div class="flex justify-center items-center mb-4">
      <h2 class="text-xl">Lista de Asistencia</h2>
    </div>

    <table class="w-full bg-gray-900">
      <thead>
        <tr>
          <th class="py-2 px-4 text-gray-300">Empleado</th>
          <th class="py-2 px-4 text-gray-300">Fecha</th>
          <th class="py-2 px-4 text-gray-300">Hora</th>
        </tr>
      </thead>
      <tbody class="bg-gray-800">
        <tr
          v-for="attendance in attendances"
          :key="attendance.id"
          class="border-b border-gray-700"
        >
          <td class="py-2 px-4 text-gray-400">{{ attendance.empleado }}</td>
          <td class="py-2 px-4 text-gray-400">{{ formatDate(attendance.fecha) }}</td>
          <td class="py-2 px-4 text-gray-400">{{ formatTime(attendance.hora) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      attendances: [],
      selectedAttendance: {
        empleado: "",
        fecha: "",
      },
    };
  },
  mounted() {
    this.fetchAttendances();
  },
  methods: {
    fetchAttendances() {
      axios
        .get("https://localhost:3000/api/attendance")
        .then((response) => {
          this.attendances = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    formatDate(date) {
      // Formatear la fecha a día/mes/año
      const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
      return new Date(date).toLocaleDateString(undefined, options);
    },
    formatTime(time) {
      // Formatear la hora a hora:minuto
      return new Date(`1970-01-01T${time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },
  },
};
</script>

<style scoped>
/* Estilos adicionales si lo necesitas */
</style>
