# shabi-hooks

> Helper Hooks to simplify code!

[![NPM](https://img.shields.io/npm/v/shabi-hooks.svg)](https://www.npmjs.com/package/shabi-hooks) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save shabi-hooks
```

## Usage

```jsx
import React from 'react'
import {usePaginationAPI} from 'shabi-hooks'
import {getItems} from "./items.API"

const HelloWorld = () => {
  // Use Logger to log the request and the response
  const {handleFetch, loading, pages, response} = usePaginationAPI({apiFn: getItems, logger: true});
  
	useEffect(() => {
		handleFetch({page: 1, perPage: 15});
  }, []);
  
  return <div>
      {loading && <span>Loading...</span>}
      {apiError && <span>{apiError.message}</span>}
      {response.map(item=> (
        <h1>{item.title}</h1>
      ))}
  </div>
}
const HelloWorld2 = () => {
	const {handleClick, loading, apiError, results} = useFetchAPI({apiFn: getItems});
  
  return <div>
      {loading && <span>Loading...</span>}
      {apiError && <span>{apiError.message}</span>}

      <button onClick={handleClick}>Get Items</button>

      {results.map(item=> (
        <h1>{item.title}</h1>
      ))}
  </div>
}

import {useForm} from "react-hook-form";

const EditWorld = ({id,title}) => {
	const {register, handleSubmit, errors, reset} = useForm();
	const {onSubmit, results, apiError, loading} = useAPI({apiFn: postItem, reset});
  
  const apiErrors = apiError?.data?.errors || [];
  // Title Error will be either a useForm error message or an apiError
  const titleError = errors?.title?.message || (apiErrors?.[0]?.source === "title" ? apiErrors?.[0]?.message : "");
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>

      <input ref={register()} name="id" type="hidden" value={id} />
      <input 
        ref={register({
          required: "The title field is required.",
          minLength: {
            value: 2,
            message: "The title must be greater than 2 characters.",
          },
        })} 
        name="title"
        defaultValue={title} 
      />
      {titleError && <span>{titleError}</span>}

      {loading ? (
        <button type="button">Loading</button>
      ) : (
        <button type="submit">Create Item</button>
      )}
    </form>
  );
}

const CreateWorld = () => {
  const {register, handleSubmit, errors, reset} = useForm();
  // On Success the form will be resetted
	const {onSubmit, results, loading} = useAPI({apiFn: postItem, reset});
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input 
        ref={register({
          required: "The title field is required.",
          minLength: {
            value: 2,
            message: "The title must be greater than 2 characters.",
          },
        })} 
        name="title"
      />
      {errors?.title?.message && <span>{errors?.title?.message}</span>}

      {loading ? (
        <button type="button">Loading</button>
      ) : (
        <button type="submit">Create Item</button>
      )}
    </form>
  );
}
```

## License

MIT © [arbershabani97](https://github.com/arbershabani97)
