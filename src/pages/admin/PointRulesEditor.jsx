// import React, { useEffect, useState } from 'react';
// import config from '../../config';
// import { toast } from 'react-toastify';
// import Cookies from "js-cookie";

// const PointRulesEditor = () => {
//   const [rules, setRules] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [newKey, setNewKey] = useState('');
//   const [newValue, setNewValue] = useState('');
//   const token = Cookies.get("AdminToken") || localStorage.getItem("token");

//   const fetchRules = async () => {
//     try {
//       const res = await fetch(`${config.BACKEND_URL}/admin/referrel/point-rules`, {
//         headers: {
//   authorization: token,
// },
//       });
//       const data = await res.json();
//       if (data.status === 'success') setRules(data.rules);
//       else toast.error(data.message || 'Failed to fetch rules');
//     } catch (err) {
//       toast.error('Error fetching rules');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateRule = async (id, value) => {
//     try {
//       const res = await fetch(`${config.BACKEND_URL}/admin/referrel/point-rules`, {
//         method: 'POST',
//         headers: {
//   authorization: token,
// },
//         body: JSON.stringify({ id, value }),
//       });
//       const data = await res.json();
//       if (data.status === 'success') toast.success('Rule updated');
//       else toast.error(data.message || 'Failed to update rule');
//       fetchRules();
//     } catch {
//       toast.error('Network error during update');
//     }
//   };

//   const addNewRule = async () => {
//     if (!newKey || isNaN(newValue)) {
//       toast.error("Please provide valid key and value");
//       return;
//     }

//     try {
//       const res = await fetch(`${config.BACKEND_URL}/admin/referrel/point-rules`, {
//         method: 'POST',
//         headers: {
//   authorization: token,
// },
//         body: JSON.stringify({ key: newKey.trim(), value: Number(newValue) }),
//       });

//       const data = await res.json();
//       if (data.status === 'success') {
//         toast.success("New rule added or updated!");
//         setNewKey('');
//         setNewValue('');
//         fetchRules();
//       } else {
//         toast.error(data.message || 'Failed to add rule');
//       }
//     } catch {
//       toast.error("Network error while adding rule");
//     }
//   };

//   useEffect(() => {
//     fetchRules();
//   }, []);

//   return (
//     <div className='p-6 text-white max-w-xl mx-auto'>
//       <h2 className='text-2xl font-bold mb-6 text-yellow-400'>🎯 Point Rules Editor</h2>

//       {loading ? (
//         <p>Loading rules...</p>
//       ) : (
//         <>
//           {rules.map(rule => (
//             <div key={rule._id} className='mb-6'>
//               <label className='block text-sm font-medium text-gray-300 mb-2 capitalize'>
//                 {rule.key.replace(/-/g, ' ')}
//               </label>
//               <input
//                 type='number'
//                 value={rule.value}
//                 onChange={e => updateRule(rule._id, parseInt(e.target.value))}
//                 className='bg-gray-900 border border-gray-700 p-2 rounded w-full text-white focus:outline-none focus:ring focus:ring-yellow-500'
//               />
//             </div>
//           ))}

//           <hr className='my-8 border-gray-600' />

//           <h3 className='text-lg font-semibold text-yellow-400 mb-4'>➕ Add New Rule</h3>
//           <div className='flex gap-3 mb-4'>
//             <input
//               type='text'
//               placeholder='Enter key (e.g. referral-bonus)'
//               value={newKey}
//               onChange={e => setNewKey(e.target.value)}
//               className='bg-gray-900 border border-gray-700 p-2 rounded w-full text-white'
//             />
//             <input
//               type='number'
//               placeholder='Value'
//               value={newValue}
//               onChange={e => setNewValue(e.target.value)}
//               className='bg-gray-900 border border-gray-700 p-2 rounded w-40 text-white'
//             />
//             <button
//               onClick={addNewRule}
//               className='bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white'
//             >
//               Add
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default PointRulesEditor;
