<template>
    <div class="bg-gray-900 py-4">
      <div class="flex justify-between items-center px-4 mb-4">
        <h2 class="text-white text-lg">Lista de Empleados</h2>
        <button class="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg" @click="openForm('create')">Agregar Empleado</button>
      </div>
  
      <table class="w-full mx-auto bg-gray-800 rounded-lg">
        <thead>
          <tr>
            <th class="py-2 px-4 text-gray-300">Código</th>
            <th class="py-2 px-4 text-gray-300">Nombre</th>
            <th class="py-2 px-4 text-gray-300">Departamento</th>
            <th class="py-2 px-4 text-gray-300">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.codigo" class="border-b border-gray-700">
            <td class="py-2 px-4 text-gray-400">{{ item.codigo }}</td>
            <td class="py-2 px-4 text-gray-400">{{ item.nombre }}</td>
            <td class="py-2 px-4 text-gray-400">{{ item.departamento }}</td>
            <td class="py-2 px-4 text-gray-400">
              <button class="text-blue-500 hover:text-blue-700" @click="editItem(item)">Editar</button>
              <button class="text-red-500 hover:text-red-700" @click="deleteItem(item)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Ventana flotante -->
      <div v-if="showForm" class="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50">
        <div class="bg-white p-4 rounded-lg">
          <h3 class="text-lg font-bold mb-4">{{ formTitle }}</h3>
          <div class="flex flex-col mb-4">
            <label for="nombre" class="mb-2">Nombre:</label>
            <input type="text" id="nombre" class="py-2 px-4 border border-gray-300 rounded" v-model="selectedEmployee.nombre">
          </div>
          <div class="flex flex-col">
            <label for="departamento" class="mb-2">Departamento:</label>
            <input type="text" id="departamento" class="py-2 px-4 border border-gray-300 rounded" v-model="selectedEmployee.departamento">
          </div>
          <div class="flex justify-end mt-4">
            <button class="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg mr-2" @click="saveEmployee">{{ formAction }}</button>
            <button class="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded-lg" @click="closeForm">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Swal from 'sweetalert2';
  
  export default {
    data() {
      return {
        showForm: false,
        formAction: '',
        formTitle: '',
        selectedEmployee: {
          nombre: '',
          departamento: ''
        }
      };
    },
    methods: {
      openForm(action, employee) {
        this.showForm = true;
        this.formAction = action === 'create' ? 'Guardar' : 'Actualizar';
        this.formTitle = action === 'create' ? 'Agregar Empleado' : 'Editar Empleado';
        this.selectedEmployee = { ...employee };
      },
      closeForm() {
        this.showForm = false;
      },
      saveEmployee() {
        // Lógica para guardar o actualizar el empleado
        if (this.formAction === 'Guardar') {
          Swal.fire('Empleado agregado', 'El empleado se ha agregado correctamente', 'success');
        } else {
          Swal.fire('Empleado actualizado', 'El empleado se ha actualizado correctamente', 'success');
        }
        this.closeForm();
      },
      deleteEmployee(employee) {
        Swal.fire({
          title: '¿Estás seguro?',
          text: 'Esta acción eliminará al empleado de forma permanente.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            // Lógica para eliminar el empleado
            Swal.fire('Empleado eliminado', 'El empleado se ha eliminado correctamente', 'success');
          }
        });
      }
    }
  };
  </script>
  
  <style scoped>
  /* Estilos adicionales si lo necesitas */
  </style>
  
