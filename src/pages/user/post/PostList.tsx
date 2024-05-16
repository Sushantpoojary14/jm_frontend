import React, { useState } from "react";
import { Card, Stack } from "react-bootstrap";
import { indexType, jobList } from "../../../assets/type/homeType";
import { useQuery } from "@tanstack/react-query";
import tokenAxios from "../../../hooks/tokenAxios";
import PostViewModel from "./PostViewModel";
import Pagination from "../../../components/Pagination";
import { useAppSelector } from "../../../redux/hooks";

export const PostList = ({changes}:{changes:boolean}) => {
  const [index, setIndex] = useState<indexType>({ start: 0, end: 5 });
  const [showIndex, setShowIndex] = useState<number>(1);
  const [jobData, setJobData] = useState<jobList | null>(null);
  const [show, setShow] = useState<boolean>(false);
  const user = useAppSelector((state) => state.loginReducers.user);
  const { data, isLoading } = useQuery({
    queryKey: ["all_user_posts",changes],
    queryFn: async () => {
      {
        console.log(index.start);

        const res = await tokenAxios.get(
          `all_user_posts/${user.id}/${index.start}/4`
        );

        return res.data;
      }
    },
    enabled: !!user,
  });
  const OpenModel = (job: jobList) => {
    setJobData(job);
    setShow((state) => !state);
  };
  const CloseModel = () => {
    setShow((state) => !state);
  };
  if (isLoading) {
    return <p>..loading</p>;
  }
  return (
    <>
      <PostViewModel show={show} setShow={CloseModel} job={jobData} />
      <div className="job-container">
        {data?.posts?.length === 0 ? (
          <h3>No Job Posts</h3>
        ) : (
          <>
            <Stack gap={3} className="card-container w-[90%] ">
              {data?.posts?.map((job: jobList, key: number) => {
                return (
                  <div
                    className="card"
                    key={key}
                    onClick={() => OpenModel(job)}
                  >
                    <Card.Img
                      variant="top"
                      src={"https://picsum.photos/200"}
                      width={"40%"}
                      height={"30%"}
                    />
                    <Card.Body>
                      <Card.Title>
                        <span>Title: </span>
                        {job.job_title}
                      </Card.Title>
                      <Card.Title>
                        <span>Company: </span>
                        {job.company_name}
                      </Card.Title>
                      <Card.Text>
                        <span>Posted On: </span> {job.posted_date}
                      </Card.Text>
                      <Card.Text>
                        <span>Location: </span>{" "}
                        {`${job.city.city_name}, ${job.state.state_name} - India`}
                      </Card.Text>
                      {/* <Button variant="primary">Apply</Button> */}
                    </Card.Body>
                  </div>
                );
              })}
            </Stack>
            <Pagination
              post_count={data?.post_count}
              setShowIndex={setShowIndex}
              setIndex={setIndex}
              index={index}
              showIndex={showIndex}
            />
          </>
        )}
      </div>
    </>
  );
};
