import React from 'react'
const CreateNewBlogForm = (props) => (
  <div>
    <form onSubmit={props.createNewBlogHandler}>
      <div>
        title:<input id='titleValue' type="text" onChange={props.blogTitleChangeHandler} />
      </div>
      <div>
        author:<input id='authorValue' type="text" onChange={props.blogAuthorChangeHandler} />
      </div>
      <div>
        url:<input id='urlValue' type="text" onChange={props.blogURLChangeHandler} />
      </div>
      <div>
        <button id='createNewBlogButton' type="submit">create</button>
      </div>
    </form>
  </div>
)

export default CreateNewBlogForm
