"use client";
import { IBlogs } from "@/types";
import Link from "next/link";
import React from "react";
import moment from "moment";

const BlogCard = ({ item }: { item: IBlogs }) => {

  function truncateText(text:string, maxLength:number) {
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength) + '...';
  }
  

  return (
    <div className="flex flex-wrap w-full md:w-6/12 p-2 lg:p-4 md:p-4 xl:p-6  ">
      <div className="w-full p-2 ">
        <div className="card servicesCardShadow  rounded-b-lg h-[55vh] xl:h-[45vh] 3xl:h-[45vh]">
          <div className="  h-[60%]">
            <div className="  h-full">
              <img
                className="w-full h-full rounded-t-md object-cover"
                src={item.cover_image}
              />
            </div>
          </div>
          <div className="h-[40%] rounded-b-md px-2 bg-white ">
            <div className="text-[10px] xl:text-[10px] pt-2 text-brand_text flex  ">
              <div className="border-r-2 pr-3 border-r-brand_text">
                {" "}
                <p className="">
                  {moment(item.created_at).format("MMMM DD YYYY")}
                </p>
              </div>
              <div className="border-r-2 px-3 border-r-brand_text">
                <p>{item.created_by?.name}</p>
              </div>
              <div className="hidden xl:block border-r-2 px-3 border-r-brand_text">
                <p>{item.category?.name}</p>
              </div>
              <div className="hidden xl:block  px-3 ">
                <p>{item.comments?.length} Comments</p>
              </div>
            </div>
            <div className="pt-2 ">
              <p className="text-[14px] xl:text-md">{truncateText(item.title,40)}</p>
              <p className="text-[10px] xl:text-sm pt-2 text-brand_text">
              {truncateText(item.short_description, 40)}
              </p>
            </div>
            <Link shallow href={`/blog/${item.slug}`}>
              <div className="text-[10px]  xl:text-sm text-brand_headings pt-3">
                Read more
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;