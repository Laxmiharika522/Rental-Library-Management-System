import requests

def fetch_book_rating(isbn):
    try:
        url = f"https://www.googleapis.com/books/v1/volumes?q=isbn:{isbn}"
        response = requests.get(url)
        data = response.json()

        if "items" in data:
            volume_info = data["items"][0]["volumeInfo"]
            return {
                "average_rating": volume_info.get("averageRating", 0),
                "ratings_count": volume_info.get("ratingsCount", 0)
            }

        return {"average_rating": 0, "ratings_count": 0}

    except Exception as e:
        print("Error fetching from Google Books:", e)
        return {"average_rating": 0, "ratings_count": 0}