import React from 'react'
const CreateNewBlogForm = (props) => (
  <div>
    <form onSubmit={props.createNewBlogHandler}>
      <div>
        title:<input type="text" onChange={props.blogTitleChangeHandler} />
      </div>
      <div>
        author:<input type="text" onChange={props.blogAuthorChangeHandler} />
      </div>
      <div>
        url:<input type="text" onChange={props.blogURLChangeHandler} />
      </div>
      <div>
        <button type="submit">create</button>
      </div>
    </form>
  </div>
)

export default CreateNewBlogForm
