import api from "./axiosInstance";

export const getWishlist = () => api.get("/wishlist");
export const addToWishlist = (bookId) => api.post("/wishlist", { book_id: bookId });
export const removeFromWishlist = (bookId) => api.delete(`/wishlist/${bookId}`);
export const isBookInWishlist = async (bookId) => {
    try {
        const res = await getWishlist();
        return res.data.some(item => item.book_id === bookId);
    } catch (err) {
        return false;
    }
};
