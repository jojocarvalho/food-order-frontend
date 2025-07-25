import React, { useState, useEffect } from 'react';


function App() {
  const [orders, setOrders] = useState([]);
  const [selectedOrderItems, setSelectedOrderItems] = useState([]);
  const [message, setMessage] = useState('');

  const API_BASE_URL = 'http://localhost:8080/orders';

  const menuOptions = [
    { name: 'Coca-Cola', description: 'Refrigerante de cola', type: 'refrigerante', price: 7.50 },
    { name: 'Guaraná', description: 'Refrigerante de guaraná', type: 'refrigerante', price: 6.00 },
    { name: 'Hamburger Clássico', description: 'Pão, carne, queijo, salada', type: 'hamburger', price: 25.00 },
    { name: 'Hamburger Vegano', description: 'Pão, hambúrguer de lentilha, queijo vegano', type: 'hamburger', price: 28.00 },
    { name: 'Batata Frita', description: 'Porção de batata frita crocante', type: 'batata', price: 12.00 },
  ];


  const fetchAllOrders = async () => {
    try {
      setMessage('Buscando pedidos...');
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      const data = await response.json();
      setOrders(data);
      setMessage('Pedidos carregados com sucesso!');
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      setMessage(`Erro ao buscar pedidos: ${error.message}`);
    }
  };


  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    const selectedItem = menuOptions.find(option => option.name === name);

    if (checked) {
      setSelectedOrderItems((prevSelectedItems) => [...prevSelectedItems, selectedItem]);
    } else {
      setSelectedOrderItems((prevSelectedItems) =>
        prevSelectedItems.filter((item) => item.name !== name)
      );
    }
  };


  const handlePostOrders = async () => {
    if (selectedOrderItems.length === 0) {
      setMessage('Por favor, selecione ao menos um item para adicionar ao pedido.');
      return;
    }

    setMessage('Adicionando pedido(s)...');
    try {
      for (const item of selectedOrderItems) {
        const response = await fetch(API_BASE_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            item_name: item.name,      
            total_price: item.price      
          }),
        });

        if (!response.ok) {
          throw new Error(`Erro HTTP ao adicionar ${item.name}: ${response.status}`);
        }
      }

      setMessage('Pedido(s) adicionado(s) com sucesso!');
      setSelectedOrderItems([]); 
      fetchAllOrders(); 
    } catch (error) {
      console.error('Erro ao adicionar pedido(s):', error);
      setMessage(`Erro ao adicionar pedido(s): ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Sistema de Pedidos
        </h1>

        {/* Área de Mensagens */}
        {message && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{message}</span>
          </div>
        )}

        {/* Seção de Listar Pedidos */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Pedidos Realizados</h2>
          <button
            onClick={fetchAllOrders}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            Listar Todos os Pedidos
          </button>

          {orders.length > 0 && (
            <ul className="mt-4 border border-gray-200 rounded-md divide-y divide-gray-200">
              {orders.map((order) => (
                // Usar order.orderId para a chave e order.item_name/order.total_price para exibição
                <li key={order.orderId} className="p-3 bg-gray-50 hover:bg-gray-100 flex justify-between items-center">
                  <div>
                    <p className="text-lg font-medium text-gray-900">{order.item_name}</p>
                    <p className="text-sm text-gray-500">Preço: R$ {order.total_price ? order.total_price.toFixed(2) : 'N/A'}</p>
                  </div>
                  <span className="text-xs text-gray-400">ID: {order.orderId}</span>
                </li>
              ))}
            </ul>
          )}
          {orders.length === 0 && message && message.includes('sucesso') && (
            <p className="mt-4 text-gray-600 text-center">Nenhum pedido cadastrado ainda. Clique em "Listar Todos os Pedidos" para verificar.</p>
          )}
        </div>

        {/* Seção de Adicionar Novo Pedido */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Fazer Novo Pedido</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {menuOptions.map((option) => (
              <label key={option.name} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-md shadow-sm hover:bg-gray-100 transition duration-200">
                <input
                  type="checkbox"
                  name={option.name}
                  checked={selectedOrderItems.some(item => item.name === option.name)}
                  onChange={handleCheckboxChange}
                  className="form-checkbox h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span className="text-gray-800 text-lg font-medium">{option.name}</span>
                <span className="text-gray-500 text-sm">- R$ {option.price.toFixed(2)}</span>
              </label>
            ))}
          </div>
          <button
            onClick={handlePostOrders}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            Adicionar Itens Selecionados ao Pedido
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
