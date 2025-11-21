
import Link from 'next/link';


const AddCardItem = ({ totalItems, handleViewClick }) => {

  const handleViewClick1 = () => {
    console.log('view clicked');
    handleViewClick(true);
  }
  
return(
<>    
<div className="bg-[#027E40] text-white fixed bottom-2.5 left-1/2 transform -translate-x-1/2 
   p-3 rounded-2xl z-50 w-11/12 max-w-md shadow-lg">
    <div className="flex justify-between items-center px-2">
      <h1 className="font-bold text-center">Items added ({totalItems})</h1>
     
        <button className="font-bold cursor-pointer bg-white text-green-700 px-4 py-1.5 
         rounded-full shadow hover:bg-gray-100" onClick={handleViewClick1}>
          View Cart
        </button>
      
    </div>
  </div>
</>
    )
}


export default AddCardItem;