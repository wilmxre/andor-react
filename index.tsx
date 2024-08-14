"use client";
import SubHeader from "@/components/header/sub-header";

import { loadBlogs } from "@/lib/blogs/blog.service";
import { loadCategories } from "@/lib/categories/categories.service";
import Image from "next/image";
import Link from "next/link";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import "./style.scss";

const BlogCard = ({ data }: { data: DataBlog }) => {
  return (
    <Link href={"/blogs/1"}>
      <div
        className="col-12 position-relative overflow-hidden mb-5 card-hover shadow-lg rounded-5 blog"
        style={{ aspectRatio: "16/9" }}
      >
        <Image
          src={data.attributes.image.data.attributes.url}
          fill
          alt="blog post"
        />
        ;
        <div className="overlay d-flex flex-column justify-content-end p-3 ps-5 text-white">
          <h4 className="mb-0 text-white">{data.attributes.title}</h4>
          <div className="d-flex justify-content-between align-items-center">
            <p className="mb-2">{data.attributes.date}</p>
            <p className="mb-2">
              {data.attributes.category!.data.attributes.name}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

const Categories = ({
  data,
  filterBlogs,
}: {
  data: Category;
  filterBlogs: Function;
}) => {
  return (
    <div className="col-12 position-relative">
      <h6 className="hover-text" onClick={() => filterBlogs(data.id)}>
        {data.attributes.name}
      </h6>
      <hr />
    </div>
  );
};

const Blogs = () => {
  const [blogs, setBlogs] = useState<DataBlog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setLoading] = useState<Boolean>(true);

  let constBlogs: DataBlog[];

  useEffect(() => {
    async function fetchData() {
      setBlogs(await loadBlogs());
      constBlogs = blogs;
      setCategories(await loadCategories());
      setLoading(false);
    }
    fetchData();
  }, []);

  const filterBlogs = useCallback(
    (id: number) => {
      setBlogs(blogs.filter((x) => x.attributes.category.id === id));
    },
    [blogs]
  );
  return (
    <>
      <SubHeader
        title="Blogjaink"
        subTitle="A vállalkozói szellem nem ismer határokat. Ismerd meg, hogyan
                hozhatod ki a legtöbbet magadból és az ötleteidből!"
      />

      <div className="container">
        <section>
          <div className="row">
            <div className="col-8">
              <div className="row">
                {blogs.map((item, key) => (
                  <React.Fragment key={key}>
                    <Suspense
                      fallback={
                        <p style={{ color: "black" }}>Loading feed...</p>
                      }
                    >
                      <BlogCard data={item} />
                    </Suspense>
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div className="col-4">
              <div className="card border rounded-4 shadow-lg">
                <div className="card-header">
                  <div className="card-title">
                    <h4>Kategóriák</h4>
                  </div>
                </div>
                <div className="card-body">
                  {categories.map((item, key) => (
                    <React.Fragment key={key}>
                      <Categories
                        filterBlogs={filterBlogs}
                        data={item}
                        key={key}
                      />
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Blogs;
