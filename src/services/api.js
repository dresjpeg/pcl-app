import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Funciones para PCL
export const getAllPCL = async () => {
  try {
    const response = await axios.get(`${API_URL}/pcl`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener PCL:', error);
    throw error;
  }
};

export const getPCLById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/pcl/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener PCL:', error);
    throw error;
  }
};

export const createPCL = async (pclData) => {
  try {
    const response = await axios.post(`${API_URL}/pcl`, pclData);
    return response.data;
  } catch (error) {
    console.error('Error al crear PCL:', error);
    throw error;
  }
};

export const updatePCL = async (id, pclData) => {
  try {
    const response = await axios.put(`${API_URL}/pcl/${id}`, pclData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar PCL:', error);
    throw error;
  }
};

export const deletePCL = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/pcl/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar PCL:', error);
    throw error;
  }
};

// Funciones para Usuarios
export const getAllUsuarios = async () => {
  try {
    const response = await axios.get(`${API_URL}/usuarios`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
};

export const getUsuarioById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/usuarios/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    throw error;
  }
};
