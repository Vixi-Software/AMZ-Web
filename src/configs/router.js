import { lazy } from "react";
import routePath from "../constants/routePath";
import MainLayout from "../layouts/main-layout";
import ProductLayout from "../layouts/product-layout";
import AdminLayout from "../layouts/admin-layout";
import BasicLayout from "../layouts/basic-layout";
import EmptyLayout from "../layouts/empty-layout";
import NewSeal from "../pages/NewSeal";
import FixPage from "../pages/Fix";
import Admin from "../pages/Admin";

// Sử dụng lazy cho tất cả các page
const Home = lazy(() => import("@/pages/Home"));
const Product = lazy(() => import("@/pages/Product"));
const ProductDetail = lazy(() => import("@/pages/ProductDetail"));
const Exchange = lazy(() => import("@/pages/Exchange"));
const Sale = lazy(() => import("@/pages/Sale"));
const ProductManagement = lazy(() => import("@/pages/Admin/Product"));
const PostForm = lazy(() => import("@/pages/Admin/Post/PostForm"));
const PostManagement = lazy(() => import("@/pages/Admin/Post"));
const ProductForm = lazy(() => import("@/pages/Admin/Product/ProductForm"));
const EventManagement = lazy(() => import("@/pages/Admin/Event"));
const PageManagement = lazy(() => import("@/pages/Admin/Page"));
const Login = lazy(() => import("../pages/Login"));

const AppRoute = [
    // ======= User Pages =======
    { path: routePath.home, page: Home, layout: MainLayout },
    { path: routePath.product, page: Product, layout: ProductLayout },
    { path: routePath.productDetail, page: ProductDetail, layout: BasicLayout },
    { path: routePath.exchange, page: Exchange, layout: BasicLayout },
    { path: routePath.sale, page: Sale, layout: BasicLayout },
    { path: routePath.login, page: Login, layout: EmptyLayout },
    { path: routePath.fix, page: FixPage, layout: BasicLayout },
    { path: routePath.newSeal, page: NewSeal, layout: BasicLayout },

    // ======= Admin Product Pages =======
    // { path: routePath.admin, page: ProductManagement, layout: AdminLayout, protect: true },
    { path: routePath.adminProductAdd, page: ProductForm, layout: AdminLayout, protect: true },
    { path: routePath.adminProductEdit, page: ProductForm, layout: AdminLayout, protect: true },
    { path: routePath.admin, page: Admin, layout: AdminLayout, protect: true },

    // ======= Admin Post Pages =======
    { path: routePath.adminPost, page: PostManagement, layout: AdminLayout, protect: true },
    { path: routePath.adminPostEdit, page: PostForm, layout: AdminLayout, protect: true },
    { path: routePath.adminPostAdd, page: PostForm, layout: AdminLayout, protect: true },

    // ======= Admin Event Pages =======
    { path: routePath.adminEvent, page: EventManagement, layout: AdminLayout, protect: true },
    
    // ======= Admin Config Pages =======
    { path: routePath.adminConfig, page: PageManagement, layout: AdminLayout, protect: true },
];

export default AppRoute;