import React, { useState, useEffect } from "react";
import "./App.css";
import useIntersectionObserver from "@react-hook/intersection-observer";

function App() {
    const [data, setData] = useState([]);
    const [buffer, setBuffer] = useState([]);
    const [page, setPage] = useState(1);

    const [ref, setRef] = React.useState();
    const { isIntersecting } = useIntersectionObserver(ref);

    // useEffect(() => {
    //     if (isIntersecting && ref.getAttribute("data-visit") === "false") {
    //         ref.setAttribute("data-visit", "true");
    //         alert("loading");
    //         loadMore();
    //     }
    // }, [isIntersecting]);

    useEffect(() => {
        if (isIntersecting) {
            loadMore();
        }
    }, [isIntersecting]);

    useEffect(() => {
        // if ("IntersectionObserver" in window) {
        //     console.log("Your browser supports IntersectionObserver");
        // } else {
        //     console.log("Your browser does not support IntersectionObserver");
        // }
        handleFetch(10, 10, page, false);
    }, []);

    // const loadMore = () => {
    //     setPage((old) => {
    //         setData([...data, ...buffer]);
    //         setBuffer([]);
    //         handleFetch(0, 10, old + 1);
    //         return old + 1;
    //     });
    // };

    const loadMore = () => {
        setPage((old) => {
            setData([...data, ...buffer]);
            setBuffer([]);
            handleFetch(0, 10, old + 1, true);
            return old + 1;
        });
    };

    const handleFetch = async (number, buffer, pageL, isPagination) => {
        let query = `{
        boards(ids: 1828594373) {
          items(limit: ${number + buffer} page: ${pageL}) {
            updates {
                text_body
              }
            assets {
              name
              created_at
              public_url
            }
          }
        }
      }`;
        try {
            const response = await (
                await fetch("https://api.monday.com/v2", {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization:
                            "eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjk5ODEwOTY1LCJ1aWQiOjE1MzUwNTMzLCJpYWQiOiIyMDIxLTAyLTE2VDEyOjE3OjQ1LjAwMFoiLCJwZXIiOiJtZTp3cml0ZSIsImFjdGlkIjo0MjU4MjgwLCJyZ24iOiJ1c2UxIn0.wrR7q2mQTPRJ8tOzSN2IVLDG81DJ_d-VxRkpSPSLZ2M",
                    },
                    body: JSON.stringify({
                        query: query,
                    }),
                })
            ).json();
            if (number > 0) {
                setData([...data, ...response.data.boards[0].items.slice(0, 10)]);
            }
            if (buffer > 0) {
                if (isPagination) {
                    setBuffer(response.data.boards[0].items);
                } else {
                    setBuffer(response.data.boards[0].items.slice(10));
                }
            }
        } catch (err) {
            console.log(err?.response);
        }
    };
    return (
        <div className="App">
            <div className="table">
                {data.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                {/* {data[0].assets[0].length.map((object, index) => {
                                return <th>{Object.keys(object)}</th>;
                            })}
                             */}
                                <th>Created At</th>
                                <th>Items</th>
                                <th>Message</th>
                                <th>Download File</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length > 0
                                ? data.map((object, idx1) => {
                                      return object.assets.map((temp, idx2) => {
                                          return (
                                              <tr
                                              //   ref={idx1 === data.length - 1 ? setRef : null}
                                              //   data-visit="false"
                                              >
                                                  <td>{temp.created_at}</td>
                                                  <td>{temp.name}</td>
                                                  <td>{!!object.updates[idx2] ? object.updates[idx2].text_body : ""}</td>
                                                  <td>
                                                      <a href={temp.public_url}>File</a>
                                                  </td>
                                              </tr>
                                          );
                                      });
                                  })
                                : "Loading..."}
                            {data.length > 0 ? (
                                <tr style={{ display: "inline" }} ref={setRef}>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            ) : null}
                        </tbody>
                    </table>
                ) : (
                    <h1>Please wait.....</h1>
                )}
            </div>

            {/* <div ref={setRef}>Is intersecting? {isIntersecting ? "yes" : "no"}</div> */}
        </div>
    );
}

export default App;
