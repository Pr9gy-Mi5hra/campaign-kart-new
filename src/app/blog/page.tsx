"use client";
import React, { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import fetchBlogs from "@/apiHelper/fetchBlog";
import { IBlogs, ICategories, IComments } from "@/types";
import Pagination from "@mui/material/Pagination";
import moment from "moment";
import Link from "next/link";
import fetchComments from "@/apiHelper/fetchComments";
import { CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import fetchCategory from "@/apiHelper/fetchCategory";
import Breadcrumbs from "@/components/breadCrumbs/BreadCrumbs";
import BlogCard from "@/components/blogCard/BlogCard";
import { addNotification } from "@/stores/notificationReducer";

const Blog = () => {
  const dispatch = useDispatch();
  const [blogs, setBlogs] = useState<IBlogs[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6); // or any default number you want.
  const [totalItems, setTotalItems] = useState(0);
  const [recentPost, setRecentPost] = useState<IBlogs[] | null>(null);
  const [recentComments, setRecentComments] = useState<IComments[] | null>(
    null
  );
  const [categories, setCategories] = useState<ICategories[] | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAllBlogs = async (categoryId?: string) => {
    try {
      setLoading(true);
      const apiResult = await fetchBlogs({
        search,
        page: page,
        limit: limit,
        category: categoryId,
      });

      if (apiResult.success === true) {
        setTotalItems(apiResult.data.pagination.total);
        const allBlogs = apiResult.data?.allBlogs;

        if (allBlogs) {
          setBlogs(allBlogs);
        }
      } else {
        dispatch(
          addNotification({
            id: new Date().valueOf(),
            severity: "error",
            message: "Failed to fetch data",
            open: true,
          })
        );
      }
      setLoading(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("An unexpected error occurred:", error.message);
        dispatch(
          addNotification({
            id: new Date().valueOf(),
            severity: "error",
            message: "Failed to fetch data",
            open: true,
          })
        );
        // setError("An unexpected error occurred. Please try again later.");
      }
    }
  };

  const getCategory = async () => {
    const response = await fetchCategory({});
    console.log(response.data, "data");
    setCategories(response.data.allCategories);
  };

  const fetchRecentBlogs = async () => {
    try {
      const apiResult = await fetchBlogs({
        limit: 3,
      });

      if (apiResult.success === true) {
        const allRecentBlogs = apiResult.data?.allBlogs;

        if (allRecentBlogs && allRecentBlogs.length > 0) {
          setRecentPost(allRecentBlogs);
        } else {
          // Handle the case when services are empty.
          setError("No Blogs found.");
        }
      } else {
        setError("Error fetching data: " + apiResult.message);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("An unexpected error occurred:", error.message);
        setError("An unexpected error occurred. Please try again later.");
      }
    }
  };

  const fetchRecentComments = async () => {
    try {
      const apiResult = await fetchComments({
        limit: 3,
      });

      if (apiResult.success === true) {
        const allRecentComments = apiResult.data?.allComments;

        if (allRecentComments && allRecentComments.length > 0) {
          setRecentComments(allRecentComments);
        } else {
          // Handle the case when services are empty.
          setError("No Blogs found.");
        }
      } else {
        setError("Error fetching data: " + apiResult.message);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("An unexpected error occurred:", error.message);
        setError("An unexpected error occurred. Please try again later.");
      }
    }
  };

  useEffect(() => {
    getCategory();
    fetchRecentBlogs(), fetchRecentComments();
  }, []);

  useEffect(() => {
    fetchAllBlogs();
  }, [search, page, limit]);

  function truncateText(text: string, maxLength: number) {
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength) + "...";
  }

  return (
    <div>
      <div className="h-[20vh] bg-brand_bggray pt-16 text-center ">
        <div className="text-[11px] uppercase">
          <Breadcrumbs />
        </div>
        <p className="text-3xl pt-3 font-bold">Blog</p>
      </div>
      <div className="">
        <img className="w-full" src="/assets/images/layer2.png" />
      </div>
      <div className="md:px-20 flex  flex-wrap w-full items-start px-10">
        <div className="w-full  lg:w-9/12">
          <div className=" flex flex-wrap items-center justify-start">
            {loading ? (
              <div className="flex justify-center items-center min-h-screen w-full">
                <div className="text-blue-500 ">
                  <CircularProgress color="inherit" size={20} />
                </div>
              </div>
            ) : !blogs || blogs.length < 1 ? (
              <p className=" h-screen justify-center items-center">
                No Blogs Found
              </p>
            ) : (
              blogs &&
              blogs.map((item) => <BlogCard key={item?._id} item={item} />)
            )}
          </div>
          <div className="flex justify-center pb-20">
            <Pagination
              count={Math.ceil(totalItems / limit)}
              page={page}
              onChange={(e, newPage) => setPage(newPage)}
            />
          </div>
        </div>
        <div className="w-full lg:w-3/12 ">
          <div className="py-6">
            <p className="text-md font-semibold">About The Blog</p>
            <p className=" pt-2 text-[13px] text-brand_text">
              Welcome to our blog page, where we share valuable insights and
              expertise on a range of topics including digital marketing, SEO,
              SMM, brand protection, sales, and marketing. Our blog serves as a
              valuable resource for businesses and marketers seeking to stay
              ahead in the rapidly evolving digital landscape. Unlock new
              opportunities for growth, enhance your online presence, and drive
              success.Read our blogs for the latest knowledge and expertise in
              the world of digital marketing.
            </p>
          </div>
          <div className="border-y bg-white py-6">
            <div className="relative">
              <input
                className="bg-brand_lightgray text-sm py-2 pl-2 rounded-sm w-full"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
              />
              <div className="absolute top-2 text-lg text-brand_text right-3">
                <BiSearch />
              </div>
            </div>
          </div>
          <div className="py-6 border-b ">
            <p className="text-md font-semibold">Recent Posts</p>
            <div className="py-4">
              {recentPost &&
                recentPost.length > 0 &&
                recentPost.map((item) => (
                  <Link shallow href={`/blog/${item.slug}`} key={item._id}>
                    <div className="py-2 hover:text-brand_secondary">
                      <p className="text-[10px] text-brand_text">
                        {" "}
                        {moment(item.created_at).format("MMMM DD YYYY")}
                      </p>
                      <p className="text-sm">{item.title}</p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
          <div className="py-6 border-b ">
            <p className="text-md font-semibold">Recent Comments</p>
            <div className="py-4">
              {recentComments &&
                recentComments.length > 0 &&
                recentComments.map((item) => (
                  <div
                    key={item._id}
                    className="flex py-2 items-center space-x-2"
                  >
                    <p className="text-[10px] text-black">
                      {">"}
                      {truncateText(item.name, 5)} on
                    </p>
                    <Link shallow href={`/blog/${item.blog?.slug}`}>
                      <p className="text-sm text-brand_secondary">
                        {truncateText(item.blog?.title, 20)}
                      </p>
                    </Link>
                  </div>
                ))}
            </div>
          </div>
          <div className="py-6  ">
            <p className="text-md font-semibold">Categories</p>
            <div className="py-4">
              <ul className="list-disc pl-8 text-sm text-brand_headings  ">
                {categories &&
                  categories.length > 0 &&
                  categories.map((item: any) => (
                    <li
                      key={item._id}
                      onClick={() => item._id && fetchAllBlogs(item._id)}
                      className="py-1 cursor-pointer"
                    >
                      {item.name}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
