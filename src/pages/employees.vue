<template>
  <div class="employees-container">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl">Lista de Empleados</h2>
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
        @click="openForm('create')"
      >
        Agregar Empleado
      </button>
      <button
        class="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
        @click="selectEmployee"
      >
        Generar QR
      </button>
    </div>
    <table class="w-full bg-gray-900">
      <thead>
        <tr>
          <th class="py-2 px-4 text-gray-300">Código</th>
          <th class="py-2 px-4 text-gray-300">Nombre</th>
          <th class="py-2 px-4 text-gray-300">Departamento</th>
          <th class="py-2 px-4 text-gray-300">Acciones</th>
        </tr>
      </thead>
      <tbody class="bg-gray-800">
        <tr
          v-for="employee in employees"
          :key="employee.id"
          class="border-b border-gray-700"
        >
          <td class="py-2 px-4 text-gray-400">{{ employee.id }}</td>
          <td class="py-2 px-4 text-gray-400">{{ employee.nombre }}</td>
          <td class="py-2 px-4 text-gray-400">{{ employee.departamento }}</td>
          <td class="py-2 px-4 text-gray-400">
            <button
              class="text-blue-500 hover:text-blue-700"
              @click="openForm('edit', employee)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1.25em"
                viewBox="0 0 500 512"
                fill="currentColor"
                class="mr-2"
              >
                <path
                  d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"
                />
              </svg>
            </button>

            <button
              class="text-red-500 hover:text-red-700"
              @click="deleteEmployee(employee)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1.25em"
                viewBox="0 0 448 512"
                fill="currentColor"
                class="ml-2"
              >
                <path
                  d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
                />
              </svg>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Ventana flotante -->
    <div
      v-if="showForm"
      class="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50"
    >
      <div class="bg-white p-4 rounded-lg">
        <h3 class="text-lg font-bold mb-4">{{ formTitle }}</h3>
        <div class="flex flex-col mb-4">
          <label for="nombre" class="mb-2">Nombre:</label>
          <input
            type="text"
            id="nombre"
            class="py-2 px-4 border border-gray-300 rounded"
            v-model="selectedEmployee.nombre"
          />
        </div>
        <div class="flex flex-col">
          <label for="departamento" class="mb-2">Departamento:</label>
          <input
            type="text"
            id="departamento"
            class="py-2 px-4 border border-gray-300 rounded"
            v-model="selectedEmployee.departamento"
          />
        </div>
        <div class="flex justify-center mt-4">
          <button
            class="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg mr-2"
            @click="saveEmployee"
          >
            {{ formAction }}
          </button>
          <button
            class="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded-lg"
            @click="closeForm"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import axios from "axios";

export default {
  data() {
    return {
      employees: [],
      showForm: false,
      formAction: "",
      formTitle: "",
      selectedEmployee: {
        nombre: "",
        departamento: "",
      },
      selectedEmployeeId: null,
    };
  },
  mounted() {
    this.fetchEmployees();
  },
  methods: {
    selectEmployee() {
    // Mostrar ventana emergente para seleccionar empleado
    Swal.fire({
      title: "Seleccionar Empleado",
      input: "select",
      inputOptions: this.getEmployeeOptions(),
      inputPlaceholder: "Seleccione un empleado",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "Debe seleccionar un empleado";
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.selectedEmployeeId = result.value;
        this.generateQRCode();
      }
    });
  },
  getEmployeeOptions() {
    const options = {};
    this.employees.forEach((employee) => {
      options[employee.id] = employee.nombre;
    });
    return options;
  },
  generateQRCode() {
    const employeeId = this.selectedEmployeeId;

    // Verificar si se ha seleccionado un empleado
    if (!employeeId) {
      return;
    }

    // Generar el código QR
    const qrCodeData = `https://example.com/scan?id=${employeeId}`; // Reemplaza "https://example.com/scan" con la URL real de tu escáner
    const qrCodeImage = document.createElement("img");
    qrCodeImage.src = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
      qrCodeData
    )}`;

    // Abrir una nueva pestaña con la imagen del código QR
    const newTab = window.open();
    newTab.document.body.appendChild(qrCodeImage);
  },



    fetchEmployees() {
      axios
        .get("http://localhost:3000/api/registros")
        .then((response) => {
          this.employees = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    openForm(action, employee) {
      this.showForm = true;
      this.formAction = action === "create" ? "Guardar" : "Actualizar";
      this.formTitle =
        action === "create" ? "Agregar Empleado" : "Editar Empleado";
      this.selectedEmployee = { ...employee };
    },
    closeForm() {
      this.showForm = false;
    },
    saveEmployee() {
      if (this.formAction === "Guardar") {
        axios
          .post("http://localhost:3000/api/registros", {
            nombre: this.selectedEmployee.nombre,
            departamento: this.selectedEmployee.departamento,
          })
          .then((response) => {
            Swal.fire(
              "Empleado agregado",
              "El empleado se ha agregado correctamente",
              "success"
            );
            this.fetchEmployees();
            this.closeForm();
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        axios
          .put(
            `http://localhost:3000/api/registros/${this.selectedEmployee.id}`,
            {
              nombre: this.selectedEmployee.nombre,
              departamento: this.selectedEmployee.departamento,
            }
          )
          .then((response) => {
            Swal.fire(
              "Empleado actualizado",
              "El empleado se ha actualizado correctamente",
              "success"
            );
            this.fetchEmployees();
            this.closeForm();
          })
          .catch((error) => {
            console.error(error);
          });
      }
    },
    deleteEmployee(employee) {
      Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción eliminará al empleado de forma permanente.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`http://localhost:3000/api/registros/${employee.id}`)
            .then((response) => {
              Swal.fire(
                "Empleado eliminado",
                "El empleado se ha eliminado correctamente",
                "success"
              );
              this.fetchEmployees();
            })
            .catch((error) => {
              console.error(error);
            });
        }
      });
    },
  },
};
</script>

<style scoped>
/* Estilos adicionales si lo necesitas */
</style>
