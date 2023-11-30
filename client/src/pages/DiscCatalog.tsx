import { useContext, useEffect, useState } from 'react';
import './DiscCatalog.css';
import { fetchDiscs } from '../lib/fetch';
import { Link } from 'react-router-dom';
// import { CartArray } from './Cart';
import { AppContext } from '../components/AppContext';
import { FaCheck } from 'react-icons/fa6';

export type Disc = {
  discId: number;
  price: number;
  image1Url: string;
  name: string;
  brand: string;
  classification: string;
  plastic: string;
  stability: string;
  weight: number;
  speed: number;
  glide: number;
  turn: number;
  fade: number;
};

export type CartDisc = Disc & { quantity: number };

export type DiscArray = Disc[];

export function DiscCatalog() {
  const [discsData, setDiscsData] = useState<DiscArray>([]);
  useEffect(() => {
    async function readDiscsData() {
      try {
        const data: DiscArray = await fetchDiscs();
        console.log('disc Data from server:', data);
        setDiscsData(data);
      } catch (error) {
        throw new Error('an error occured loading products');
      }
    }
    readDiscsData();
  }, []);

  return (
    <div className="flex">
      <div className="max-h-screen mt-8 w-1/5 flex items-start">
        <div className="w-full">
          <h5>filter & sort</h5>
          <p>by brand</p>
          <p>by stability</p>
          <p>by flight</p>
          <p>by type</p>
        </div>
      </div>
      <div className="w-full">
        <div className="container row">
          {discsData?.map((disc) => (
            <div
              key={disc.discId}
              className="shadow-xl border border-red-50 rounded sm:w-full md:w-2/5 lg:w-1/5">
              <DiscCard disc={disc} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

type DiscsCardProps = {
  disc: Disc;
};

function DiscCard({ disc }: DiscsCardProps) {
  const { bagData, cartData, handleAddToBag, handleAddToCart } =
    useContext(AppContext);

  const {
    image1Url,
    discId,
    name,
    brand,
    price,
    plastic,
    speed,
    glide,
    turn,
    fade,
    // classification,
    // stability,
  } = disc;

  const flight = `${speed} | ${glide} | ${turn} | ${fade}`;

  let isInCart = false;
  for (let i = 0; i < cartData.length; i++) {
    if (cartData[i].discId === disc.discId) {
      isInCart = true;
    }
  }
  let isInBag = false;
  for (let i = 0; i < bagData.length; i++) {
    if (bagData[i].discId === disc.discId) {
      isInBag = true;
    }
  }

  return (
    <>
      <Link to={`/disc-details/${discId}`}>
        <div className="container">
          <img className="w-full" src={image1Url} alt={name}></img>
        </div>
        <div>
          <h5 className="text-center">
            {brand} | {plastic}
          </h5>
          <h5 className="text-center">{name}</h5>
          {/* <p>{brand}</p> */}
          {/* <p>{plastic}</p> */}
          <p className="text-center">{flight}</p>
          {/* <p>{classification}</p>
          <p>{stability}</p> */}
          <p className="text-center">{price}</p>
        </div>
      </Link>
      <div className="flex flex-nowrap justify-around">
        {isInBag ? (
          <button disabled className="flex flex-nowrap">
            <FaCheck />
            in bag!
          </button>
        ) : (
          <button onClick={() => handleAddToBag(discId)}>Bag It!</button>
        )}
        {isInCart ? (
          <button disabled className="flex flex-nowrap">
            <FaCheck />
            in cart!
          </button>
        ) : (
          <button onClick={() => handleAddToCart(discId)}>Buy It!</button>
        )}
      </div>
    </>
  );
}
