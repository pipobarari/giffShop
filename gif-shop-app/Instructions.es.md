  

A continuación te muestro una guía para crear una aplicación con redux en Next.js, utilizando TypeScript, Tailwind, Functional components.
 

##  Paso 1: Configuración del entorno de desarrollo
 
Antes de empezar, necesitarás tener instalado Node.js y un editor de código de tu elección. Luego, puedes crear un nuevo proyecto de Next.js con TypeScript y TailwindCSS ejecutando el siguiente comando en la terminal:
 
```bash
 
npx create-next-app gif-shop-app --ts --tailwind --eslint --src-dir --import-alias "@/*"
```
Este comando creará una nueva aplicación de Next.js con TypeScript y TailwindCSS configurados.
 
##  Paso 2: Instalar Redux
 
Para instalar Redux, ejecuta el siguiente comando en la terminal:
 
```bash

npm install redux react-redux @reduxjs/toolkit redux-thunk
 
```
Este comando instalará Redux, React-Redux, Redux Toolkit y Redux Thunk en tu proyecto.

### Que es Redux
Redux es una librería de gestión de estado para aplicaciones JavaScript que se utiliza comúnmente en conjunto con frameworks como React. Los conceptos mas importantes de Redux se puede definir en los siguientes puntos:
![Esquema de redux básico](https://drive.google.com/file/d/1Fvmmea4hB_QYkgn2DtbuRXZlUXMP3et9/view?usp=sharing "Redux")


1.  Almacenamiento centralizado: Redux mantiene todo el estado de la aplicación en un solo objeto llamado "store". Este objeto se almacena en la memoria y se puede acceder desde cualquier parte de la aplicación.
    
2.  Estado inmutable: El estado de la aplicación en Redux es inmutable, lo que significa que no se puede cambiar directamente. En su lugar, se realizan cambios en el estado a través de "acciones", que son objetos que describen qué cambios deben realizarse.
    
3.  Reducers: Las acciones se procesan mediante "reducers", que son funciones puras que toman el estado actual y la acción correspondiente, y devuelven un nuevo estado. Los reducers en Redux deben ser funciones puras, lo que significa que no deben tener efectos secundarios y siempre deben devolver el mismo resultado para los mismos argumentos.
    
4.  Flujo de datos unidireccional: Redux sigue un patrón de flujo de datos unidireccional, lo que significa que el estado de la aplicación fluye en una sola dirección, desde el "store" a los componentes de la aplicación. Los cambios en el estado se realizan mediante acciones que se envían al "store", y los componentes se actualizan automáticamente cuando el estado cambia.

6.  Thunks: Los "thunks" son funciones asíncronas que se utilizan para realizar operaciones asíncronas como llamadas a API en Redux. Los thunks se llaman desde los componentes de la aplicación y pueden despachar acciones para actualizar el estado de la aplicación. Los thunks se implementan comúnmente utilizando la librería "redux-thunk", que permite que las acciones despachadas por los thunks sean funciones en lugar de objetos simples.
    
7.  Selectors: Los "selectors" son funciones que se utilizan para obtener datos específicos del estado de la aplicación en Redux. Los selectores se utilizan para extraer datos de la forma de estado compleja y devolver solo la porción necesaria del estado a los componentes de la aplicación. Los selectores pueden ser funciones simples o funciones más complejas que combinan datos de varias partes del estado. Los selectores se implementan comúnmente utilizando la librería "reselect", que permite que los selectores se memoricen y se vuelvan a calcular solo cuando cambian los datos relevantes del estado.
    
Redux facilita el desarrollo de aplicaciones escalables al proporcionar una forma estructurada y predecible de administrar el estado de la aplicación. Al mantener el estado centralizado y predecible, Redux hace que sea más fácil rastrear los cambios en la aplicación y solucionar problemas. También hace que sea más fácil agregar nuevas características a la aplicación sin tener que reescribir grandes partes del código existente.
 
<iframe src="https://drive.google.com/file/d/1JUxmcCy0SuEm_q8DDWod-I4OEGL-nr5o/preview" width="640" height="480" allow="autoplay"></iframe>
 Veamos ahora de que trata la implementación de redux
 
##  Paso 3: Crear el store
 
Crea un archivo llamado `src/root/redux/store.ts` y agrega el siguiente código:
 
```typescript
import { configureStore } from "@reduxjs/toolkit"; 
import { TypedUseSelectorHook, useSelector } from 'react-redux'

import { gifReducer } from "@/root/redux/reducers/gif-reducer/gifReducer";
// import { cartReducer } from './reducers/cart-reducer/cartReducer';

export const ApplicationStore = configureStore({
  reducer: {
    gifStore: gifReducer,
    //cartStore: cartReducer,
  }, 
});

export type RootState = ReturnType<typeof ApplicationStore.getState>;
export default ApplicationStore;

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector
```
 
Este archivo configura  el store de Redux para tu aplicación y lo exportará para que puedas acceder a él en otros archivos.
note que en la propiedad reducer, tenemos dos atributos(uno comentado para que lo usen mas adelante), son entidades que utilizaremos en la aplicacion, son diferentes y las trabajamos en archivos separados.
   
##  Paso 4: Crear los reducers
 
Crea un archivo llamado `src/root/redux/reducers/gif-reducer/gifReducer.ts`   y agrega el siguiente código:
 
```typescript
 import { createSlice, PayloadAction } from "@reduxjs/toolkit"; 
import { Gif } from "@/root/types/Gif.type";
 
interface GifState {
  gifs: Gif[];
}

export const initialState: GifState = {
  gifs: [],
};

export const gifSlice = createSlice({
  name: "gif",

  initialState,

  reducers: {
    setGifs: (state, action: PayloadAction<Gif[]>) => {
      state.gifs = action.payload;
    },
  },
});

export const { setGifs } = gifSlice.actions;
export const gifReducer = gifSlice.reducer;

```
 
Este archivo define el estado inicial y los reducers para el slice de `gif`. Note que por ser un reducer, no podemos llamar al api desde acá ya que solo podemos utilizar llamadas puras. 

### agreguemos los selectors
Crea un archivo llamado `src/root/redux/selectors/gif-selector/gif.selector.ts`   y agrega el siguiente código:
```typescript
import  { RootState }  from  '@/root/redux/store';

export  const  selectGifs  =  (state:  RootState)  =>  state.gifStore.gifs;
```

### agreguemos los thunks
Crea un archivo llamado `src/root/redux/thunks/gif-thunk/gif.thunk.ts`   y agrega el siguiente código:
```typescript
import  { setGifs }  from  "@/root/redux/reducers/gif-reducer/gifReducer";
import  { DispatchType }  from  "@/root/redux/reducers/cart-reducer/cartReducer";
import  { gifProvider }  from  "@/root/redux/provider/gif/gif.provider";

export  const  startSetGif  =  (searchTerm:  string):  any  =>  {
	return  async (dispatch:  DispatchType) => {
		const  gifList  =  await  gifProvider(searchTerm);
		dispatch(setGifs(gifList  || []));
	};
};
```
Es importante analizar el funcionamiento de un thunk, llamamos al thunk para que consulte el api, dure lo que tenga que durar, y si funciona que actualice el estado, de una manera pura, ya contando con la información necesaria.

### agreguemos los providers
Crea un archivo llamado `src/root/redux/providers/gif-provider/gif.provider.ts`   y agrega el siguiente código:
```typescript
import  { Gif }  from  "@/root/types/Gif.type";

const  apiKey  =  "---API-KEY-GIPHY---";
const  getGifUrl  =  (searchTerm:  string,  limit  =  5)  =>
`https://api.giphy.com/v1/gifs/search?q=${searchTerm}&api_key=${apiKey}&limit=${limit}`;

export  const  gifProvider  =  async  (searchTerm:  string)  =>  {
try {
	const  response  =  await  fetch(getGifUrl(searchTerm));
	if (!response.ok) {
		throw  new  Error("Network response was not ok");
	}

	const  data  =  await  response.json();
	const  gifs  =  data.data.map(
		(gif:  any):  Gif  => ({
			id:  gif.id,
			title:  gif.title,
			url:  gif.images.fixed_width.url,
		 })
		);
		return  gifs;
	} catch (error) {
		return  error;
	}
};
```
##  Paso 5: Agregando orden y archivos pendientes
### Conseguir el API Key de GIPHY 
  Utilice el enlace para conseguir su apikey https://developers.giphy.com/ y agreguelo al provider `/providers/gif/gif.provider.ts`
 ### Autorizar el uso de imagenes externas en nuestro sitio
 Por seguridad next.js solo permite imagenes que estan en la carpeta public, sin embargo podemos indicar explicitamente que se permiten cierto dominio, sin embargo en este caso gyphy tiene multiples servidores desde donde llegan las imagenes y necesitamos definir un patrón sobre que posibles dominios sean permitidos.
  Modifique el archivo `next.config.js` y agrega el siguiente código:
```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.giphy.com',
      },
    ], 
  },
}

module.exports = nextConfig
```
  ### Agreguemos los types necesarios
  Crea un tipo llamado `root/types/Gif.type.ts` y agrega el siguiente código:
```typescript
 export  type  Gif  =  {
	id:  string;
	title:  string;
	url:  string;
 };
```
 ### Agreguemos un archivo para constantes generales
  
Crea un archivo llamado `root/constants/common.constants.ts`   y agrega el siguiente código:
```typescript
 export  const  promotionPrice  =  7.97;
```
### Agregamos el provider de redux a nuestra aplicación 
En este caso se requiere que este HOC este a un nivel mínimo donde se utilice, como se utiizará en toda la aplicación se debe colocar en el componente _app.tsx quedando el código así:
```typescript
import  "@/styles/globals.css";
import  type  { AppProps }  from  "next/app";
import  { Provider }  from  "react-redux";
import  ApplicationStore  from  "@/root/redux/store";

export  default  function  App({  Component,  pageProps  }:  AppProps)  {
	return (
		<Provider  store={ApplicationStore}>
			<Component  {...pageProps}  />
		</Provider>
	);
}
```
Ahora cualquier página de nuestra aplicación puede acceder al Provider de redux, de ahi su nombre ApplicationStore, se podría tener diferentes stores, pero esto solo se puede aplicar en monolitos gigantes que pueden utilizar diferentes APIs, módulos muy separados o alguna configuración particular que lo requiera.
##  Paso 6: Creando los componentes de la aplicación
### Agreguemos el componente SearchBar
Crea un componente llamado `src/root/components/search-bar/SearchBar.tsx`   y agrega el siguiente código:
```typescript
 import { startSetGif } from "@/root/redux/thunks/gif.thunk";
import { useDispatch } from "react-redux";

function SearchBar() {
  const dispatch = useDispatch();

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let searchTerm = event.currentTarget.searchTerm.value.trim();
    if (!searchTerm) {
      searchTerm="dogs";
    }
    console.log(searchTerm);
    
    dispatch(startSetGif(searchTerm));
  };

  return (
    <form onSubmit={handleSearch} className="my-8 w-3/4 ">
      <label
        htmlFor="default-search"
        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
      >
        Search
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            aria-hidden="true"
            className="w-5 h-5 text-gray-500 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <input
          type="search"
          name="searchTerm"
          id="default-search"
          className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Search for dogs, GIFs dogs or maybe other GIFs related with dogs"
          required
        />
        <button
          type="submit"
          className="btn-primary absolute right-2.5 bottom-2.5"
        >
          Search
        </button>
      </div>
    </form>
  );
}

export default SearchBar;

```
Tomese un tiempo para observar como interactua el formulario con redux y de un posible error, si lo encontro corrijalo.
### Agreguemos el componente GifList 
Crea un componente llamado `src/root/components/gif-list/GifList.tsx`   y agrega el siguiente código:
```typescript
import { useSelector } from "react-redux";
import { Gif } from "@/root/types/Gif.type";
import { GifItem } from "../gif-item/GifItem";
import { promotionPrice } from "@/root/constants/common.constant";
import { selectGifs } from "@/root/redux/selectors/gif-selector/gif.selector";

export const GifList = () => {
  const gifFoundList = useSelector(selectGifs);

  return (
    <div className="grid grid-cols-3 gap-4 justify-center">
      {gifFoundList.map((gif: Gif) => (
        <GifItem
          key={gif.id}
          title={gif.title}
          gifImageUrl={gif.url}
          price={promotionPrice}
        />
      ))}
    </div>
  );
};

```
De nuevo revise como hace este formulario para trabajar.
### Agreguemos el componente GifItem
Crea un componente llamado `src/root/components/gif-item/GifItem.tsx`   y agrega el siguiente código:
```typescript
import React from "react";
import Image from "next/image";
import RatingStars from "./components/rating-stars/RatingStars";

export interface GiftItemProps {
  title: string;
  gifImageUrl: string;
  price: number;
}

export const GifItem = ({ title, gifImageUrl, price }: GiftItemProps) => {
  return (
    <div className="  w-full   max-w-sm  bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <a href="#">
              <Image
                  priority={false}
                  width={300}
                  height={300}
          className="p-8 rounded-t-lg"
          src={gifImageUrl}
          alt="product image"
        />
      </a>
      <div className="px-5 pb-5">
        <a href="#">
          <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {title}
          </h5>
        </a>
        <RatingStars />
        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-red-900 dark:text-white">
            ${price}
          </span>
          <a
            href="#"
            className="btn-primary"
          >
            Add to cart
          </a>
        </div>
      </div>
    </div>
  );
};

export default GifItem;

```
### Creamos un subcomponente 
Para evitar el código repetido en este componente se ha extraido el componente RatingStar
Crea un componente llamado `src/root/components/gif-item/components/rating-stars/RatingStars.tsx`   y agrega el siguiente código:
```typescript
import React from 'react'
 
export const RatingStars = () => {
    return (
      <div className="flex items-center mt-2.5 mb-5">
        <svg
          aria-hidden="true"
          className="w-5 h-5 text-yellow-300"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>First star</title>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
        </svg>
        <svg
          aria-hidden="true"
          className="w-5 h-5 text-yellow-300"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Second star</title>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
        </svg>
        <svg
          aria-hidden="true"
          className="w-5 h-5 text-yellow-300"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Third star</title>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
        </svg>
        <svg
          aria-hidden="true"
          className="w-5 h-5 text-yellow-300"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Fourth star</title>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
        </svg>
        <svg
          aria-hidden="true"
          className="w-5 h-5 text-yellow-300"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Fifth star</title>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
        </svg>
        <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-3">
          5.0
        </span>
      </div>
    );
  }

export default RatingStars
```
Este componente es totalmente básico pero nos ayuda a simplificar el gifItem.tsx  
##  Paso 7: Trabajar con los estilos
En el archivo llamado `Styles/globals.css` y agregue el siguiente código:
 
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components  {
	.btn-primary  {
		@apply text-white bg-blue-700 hover:bg-blue-800 focus:ring-4  focus:outline-none  focus:ring-blue-300  font-medium  rounded-lg  text-sm  px-4  py-2  dark:bg-blue-600  dark:hover:bg-blue-700  dark:focus:ring-blue-800;
	}
}
```
Revise estas nuevas lineas de código, y piense para que se definio esto?, puede realizar una busqueda en el código para observar como se esta utilizando y deducir su funcionamiento, discutalo con el profesor.
   

##  Paso 8: Ejecutar la aplicación
Ejecuta la aplicación con el siguiente comando:
```
npm run dev
```
Abre el navegador en `http://localhost:3000` para ver la aplicación en funcionamiento.
¡Felicidades! Has construido una aplicación web básica de compras que utiliza Redux para administrar el estado. Espero que esta guía haya sido útil para ti. Si tienes preguntas o comentarios, no dudes en preguntar. ¡Gracias por seguir esta guía!
Esta guía fue cocreada con ghatgpt utilizando la herramienta poe.com
Para editar markdown en tiempo real, se utilizo https://stackedit.io/app#
Ponga en practica su nuevo conocimiento agregando un carro de compras a nuestra aplicación

## Paso 9: Cree un menu desplegable para mostrar el carrito de compras
Agregue el código necesario para mostrar en un menú modal la lista de los items agregados al carro de compra
### TODOS
-[ ] Cree una barra de navegación para ir a `checkout` o `market`
-[ ] Crear un reducer especifico para el carro de compras
-[ ] Crear un modal con tailwind
-[ ] Agregar un selector para obtener el total de los productos comprados


## Paso 10 : Manejo de formularios web
### TODOS
-[ ] Agregue un menu de navegación a una nueva página de `checkout`
-[ ] Lea y revise el siguiente material para obtener una idea de como manejar formularios en react:
	[https://www.kirandev.com/form-validation-nextjs-using-formik-yup](https://www.google.com/url?q=https://www.kirandev.com/form-validation-nextjs-using-formik-yup&sa=D&source=docs&ust=1682222830376945&usg=AOvVaw0NnzvZHxyT9OaZvOoJiGIW)  
	[https://www.youtube.com/watch?v=7Ophfq0lEAY](https://www.google.com/url?q=https://www.youtube.com/watch?v%3D7Ophfq0lEAY&sa=D&source=docs&ust=1682222830377097&usg=AOvVaw0aXty0Nyoc2PRAKU30Ls_I)  
	[https://dev.to/hi_iam_chris/react-forms-formik-and-yup-intro-154g](https://www.google.com/url?q=https://dev.to/hi_iam_chris/react-forms-formik-and-yup-intro-154g&sa=D&source=docs&ust=1682222830377178&usg=AOvVaw30n9WkT1UZEx_OWHXNTTrw)
-[ ] Crear una nueva página para el checkout, donde se muestre la lista de items y un formulario para dirección y tarjeta.  
-[ ] Finalmente se espera que cuando se de click al boton `pay`, se valide el formulario y se redirija a una nueva página llamada thanks y muestre el json de la información obtenida en el formulario anterior, obviamente obtenida desde el AplicationStore .
  