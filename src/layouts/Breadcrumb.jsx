import { SegmentedControl } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";

const Breadcrumb = ({ children, from }) => {
  const router = useRouter();
  const pathSegments = router.asPath
    .split("/")
    .filter((segment) => segment !== "");

  //   console.log({ pathSegments, I: pathSegments.slice(0, 2).join("/") });
  return (
    <div className="p-2 h-full">
      <nav className="px-5 ">
        <ul className="flex">
          {/* <li>
            <Link href="/">Home</Link>
          </li> */}
          {pathSegments.slice(2).map((segment, index) => (
            <li className="px-[3px] capitalize " key={index}>
              <Link
                className="text-blue-400 underline-offset-2 hover:underline transition-all"
                href={`/${pathSegments
                  .slice(0, pathSegments.length - 1 + index)
                  .join("/")}`}
              >
                {segment}
              </Link>
              <span className="px-[5px]">/</span>
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex justify-center"></div>
      <div className="">{children}</div>
    </div>
  );
};

export default Breadcrumb;
