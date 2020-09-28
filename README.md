  # shabi-hooks

  > Helper Hooks to simplify code!

  [![NPM](https://img.shields.io/npm/v/shabi-hooks.svg)](https://www.npmjs.com/package/shabi-hooks) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

  ## Install

  ```bash
  npm install --save shabi-hooks
  ```

  ## Usage


  ### UsePaginationAPI

  #### Options
  - **apiFn** - `Function` - used for providing the api call service
  - **debounceTime** - `Number` - used for changing debounce time
  - **logger** - `Boolean`- adding logs for the service execution (request, success || error)

  #### Hook Response
  - **apiCall** - `Function (params || data)` - function to be called in order to execute the apiFn provided as option
  - **loading** - `Boolean` - shows loading state of the api call
  - **pages** - `Object` - shows the 
        ```
        {
          current: 0,
          last: 0,
          loaded: [],
          perPage: 0,
          hasMore: false
        }
        ```
  - **response** - `Object` - shows the api response if the request is successful
  - **apiError** - `Object` - shows the request error

  #### Example
  ```jsx
  import React from 'react'
  import {usePaginationAPI} from 'shabi-hooks'
  import {getItems} from "./items.API"

  const HelloWorld = ({id}) => {
    const {apiCall, loading, pages, response, apiError} = usePaginationAPI({apiFn: getItems, logger: true});
    
    useEffect(() => {
      apiCall({page: 1, perPage: 15});
    }, []);

    useEffect(() => {
      // If you want to reset pagination add true, as the second property
      apiCall({id, page: 1, perPage: 15}, true);
    }, [id]);
    
    return <div>
        {loading && <span>Loading...</span>}
        {apiError && <span>{apiError.message}</span>}
        {response.map(item=> (
          <h1>{item.title}</h1>
        ))}
    </div>
  }
  export default HelloWorld;
  ```

  ### UseFetchAPI

  #### Options
  - **apiFn** - `Function` - used for providing the api call service
  - **data** - `Object` - provide the data for the api call - apiFn(data)
  - **logger** - `Boolean` - adding logs for the service execution (request, success || error)

  #### Hook Response
  - **apiCall** - `Function (params || data)` - function to be called in order to execute the apiFn provided as option
  - **loading** - `Boolean` - shows loading state of the api call
  - **response** - `Object` - shows the api response if the request is successful
  - **apiError** - `Object` - shows the request error


  ```jsx
  import React from 'react'
  import {usePaginationAPI} from 'shabi-hooks'
  import {getItems} from "./items.API"

  const HelloWorld = () => {
    const {apiCall, loading, apiError, response} = useFetchAPI({apiFn: getItems});
    
    return <div>
        {loading && <span>Loading...</span>}
        {apiError && <span>{apiError.message}</span>}

        <button onClick={apiCall}>Get Items</button>

        {response.map(item=> (
          <h1>{item.title}</h1>
        ))}
    </div>
  }
  export default HelloWorld;
  ```

  ### UseAPI

  #### Options
  - **apiFn** - `Function` - used for providing the api call service
  - **debounceTime** - `Number` - used for changing debounce time
  - **reset** - `Function` - if provided, the reset function will be executed after the function executes successfully 
  - **logger** - `Boolean` - adding logs for the service execution (request, success || error)

  #### Hook Response
  - **apiCall** - `Function (params || data)` - function to be called in order to execute the apiFn provided as option
  - **loading** - `Boolean` - shows loading state of the api call
  - **response** - `Object` - shows the api response if the request is successful
  - **apiError** - `Object` - shows the request error

  #### Edit Form Example
  ```jsx
  import React from 'react'
  import {useAPI} from 'shabi-hooks'
  import {useForm} from "react-hook-form"
  import {postItem} from "./item.API"

  const EditWorld = ({id,title}) => {
    const {register, handleSubmit, errors, reset} = useForm();
    // On Success the form will be resetted
    const {apiCall, response, apiError, loading} = useAPI({apiFn: postItem, reset});
    
    const apiErrors = apiError?.data?.errors || [];
    // Title Error will be either a useForm error message or an apiError
    const titleError = errors?.title?.message || (apiErrors?.[0]?.source === "title" ? apiErrors?.[0]?.message : "");
    
    return (
      <form onSubmit={handleSubmit(apiCall)}>

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

        {response &&  <h1>{response.title}</h1>}
      </form>
    );
  }
  ```

  #### Create Form Example

  ```jsx
  import React from 'react'
  import {useAPI} from 'shabi-hooks'
  import {useForm} from "react-hook-form"
  import {postItem} from "./item.API"

  const CreateWorld = () => {
    const {register, handleSubmit, errors, reset} = useForm();
    // On Success the form will be resetted
    const {apiCall, response, loading} = useAPI({apiFn: postItem, reset});
    
    return (
      <form onSubmit={handleSubmit(apiCall)}>
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
        {response && <h1>{response.title}</h1>}
      </form>
    );
  }
  ```

  ### UseSearch

  #### Options
  - **apiFn** - `Function` - used for providing the api call service
  - **debounceTime** - `Number` - used for changing debounce time
  - **logger** - `Boolean` - adding logs for the service execution (request, success || error)

  #### Hook Response
  - **handleChange** - `Function (event, params)` - function to be called in order to execute the apiFn provided as option
  - **searchValue** - `String` - the search input value
  - **loading** - `Boolean` - shows loading state of the api call
  - **response** - `Object` - shows the api response if the request is successful
  - **apiError** - `Object` - shows the request error

  ```jsx
  import React from 'react'
  import {useSearch} from 'shabi-hooks'
  import {searchUsers} from "./users.API"

  const Users = () => {
    const {searchValue, response, handleChange, loading} = useSearch({apiFn: searchUsers});
    
    const handleUserSearch = e => handleChange(e, {search: e.target.value});

    return (
      <div>
        <input
          name="searchUsers"
          onChange={handleUserSearch}
          placeholder="Search Users"
          type="search"
          value={searchValue}
        />

        {errors?.title?.message && <span>{errors?.title?.message}</span>}

        {loading && <span>Loading</span>}

        <h3>Users List</h3>
        <ul>
          {response.map(user=>(
            <li>{user.name}</li>
          ))}
        </ul>

      </div>
    );
  }
  export default Users;
  ```


  ## License

  MIT © [arbershabani97](https://github.com/arbershabani97)
