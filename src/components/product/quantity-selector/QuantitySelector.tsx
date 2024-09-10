// Icons
import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";

interface Props {
  quantity: number;
  inStock: number;

  onQuantityChange: (quantity: number) => void;
}


export const QuantitySelector = ({ quantity, onQuantityChange, inStock }: Props) => {

  const handleQuantityChange = ( value: number ) => {
    if ( quantity + value < 1 || quantity + value > inStock ) return;
    onQuantityChange( quantity + value )
  }

  return (
    <div className="flex items-center">
      <button onClick={ () => handleQuantityChange(-1) }>
        <IoRemoveCircleOutline size={ 30 } />
      </button>

      <span className="w-20 mx-3 px-5 bg-gray-100 text-center rounded">{ quantity }</span>

      <button onClick={ () => handleQuantityChange( +1 ) }>
        <IoAddCircleOutline size={ 30 } />
      </button>
    </div>
  )
}
