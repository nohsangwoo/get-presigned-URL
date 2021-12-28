import React, { useState } from 'react'
import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'
import PageTitle from './PageTitle'
import axios from 'axios'
import styled from 'styled-components'

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 200px;
  border: 1px solid black;
`

const Uploader = () => {
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState()

  // AWS Lambda API ENDPOINT for getPresignedURL
  const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT

  const getPresignedURL = async () => {
    // * GET request: presigned URL
    const response = await axios({
      method: 'GET',
      url: API_ENDPOINT,
    })
    return response
  }

  const handleDropzonSubmit = async files => {
    setLoading(true)
    const f = files[0]
    console.log(f['file'])
    // * GET request: presigned URL
    const response = await getPresignedURL()

    // PUT request: upload file to S3
    console.log('Uploading to: ', response.data.uploadURL)
    const result = await fetch(response.data.uploadURL, {
      method: 'PUT',
      headers: {
        'Content-Type': f['file']['type'],
      },
      body: f['file'],
    })
    console.log('Result: ', result)
    if (response.status === 200) {
      setLoading(false)
    }
  }

  const handleDropZoneChange = ({ meta, remove }, status) => {
    console.log(status, meta)
  }

  const handleNomalSubmit = async e => {
    e.preventDefault()
    const blob = new Blob([file], { type: file['type'] })
    // * GET request: presigned URL
    const response = await getPresignedURL()

    // PUT request: upload file to S3

    const result = await fetch(response.data.uploadURL, {
      method: 'PUT',
      headers: {
        'Content-Type': blob['type'],
      },
      body: blob,
    })
    console.log('Result: ', result)
    if (response.status === 200) {
      setLoading(false)
    }
  }

  const handleNomalOnChange = event => {
    setFile(event.target.files[0])
  }
  return (
    <React.Fragment>
      <PageTitle title="Uploder" />
      <div id="toast">Upload</div>
      <Dropzone
        // getUploadParams={getUploadParams}
        onChangeStatus={handleDropZoneChange}
        onSubmit={handleDropzonSubmit}
        maxFiles={1}
        multiple={false}
        canCancel={false}
        inputContent="Drop A File"
        styles={{
          dropzone: { width: 400, height: 200 },
          dropzoneActive: { borderColor: 'green' },
        }}
      />
      <div>{loading ? '전송중...' : ''}</div>
      <FormWrapper onSubmit={handleNomalSubmit}>
        <label htmlFor="avatar">Choose a profile picture:</label>
        <input
          type="file"
          onChange={handleNomalOnChange}
          id="avatar"
          name="avatar"
          accept="*"
        />
        <input type="submit" />
      </FormWrapper>
    </React.Fragment>
  )
}

export default Uploader
