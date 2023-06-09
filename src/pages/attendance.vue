<template>
  <div class="attendance-container">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-white text-lg">Lista de Asistencia</h2>
    </div>

    <table class="w-full bg-gray-800 rounded-lg">
      <thead>
        <tr>
          <th class="py-2 px-4 text-gray-300">Código</th>
          <th class="py-2 px-4 text-gray-300">Empleado</th>
          <th class="py-2 px-4 text-gray-300">Fecha</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="attendance in attendances"
          :key="attendance.id"
          class="border-b border-gray-700"
        >
          <td class="py-2 px-4 text-gray-400">{{ attendance.id }}</td>
          <td class="py-2 px-4 text-gray-400">{{ attendance.empleado }}</td>
          <td class="py-2 px-4 text-gray-400">
            {{ formatDate(attendance.fecha) }}
          </td>
          <td class="py-2 px-4 text-gray-400"></td>
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
        empelado: "",
        fecha: "",
      },
    };
  },
  mounted() {
    this.fetchAttendances();
  },
  methods: {

    formatDate(timestamp) {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleString(); // Opcional: puedes ajustar el formato de fecha y hora según tus necesidades
    return formattedDate;
  },


    fetchAttendances() {
      axios
        .get("http://localhost:3000/api/attendance")
        .then((response) => {
          this.attendances = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>

<style scoped>
/* Estilos adicionales si lo necesitas */
</style>
