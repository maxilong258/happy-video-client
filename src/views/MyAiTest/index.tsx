import { useAsync } from "@/utils/use-async"
import { useHttp } from "@/utils/use-http"
import { Input } from "antd"
import { useState } from "react"

export const MyAiTestPage = () => {
  const [text, setText] = useState('')
  const client = useHttp()

  const {
    run,
    // isLoading,
    data,
  } = useAsync<any>()

  const submit = () => {
    // run(client(`posts/views/${postId}`, { method: 'PATCH' }))
    // run(fetch(`https://api.dify.ai/v1/chat-messages`, {
    //   headers: {
    //     Authorization: 
    //   }
    // }))
  }

  return <>
  <Input onChange={(e) => setText(e.target.value)} ></Input>
  <button onClick={submit} >Submit</button>
  <div>{data}</div>
  </>

}

