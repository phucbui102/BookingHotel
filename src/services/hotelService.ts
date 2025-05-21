import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
interface HotelFilter {
  minPrice?: number;
  featuredHotels?: boolean;
  location?: string;
  hotelId?:string;
}

interface findHotelFilter {
  location:string;
  classify:string;
}

interface AddCommentInput {
  hotelId: string;
  userId: string;
  comment: string;
  rating?: number;
}
// lấy dữ liệu của hotel
export const fetchHotels = async (filter?: HotelFilter) => {
  try {
    // Nếu có hotelId, lấy trực tiếp document đó
    if (filter?.hotelId) {
      const doc = await firestore().collection('datahotel').doc(filter.hotelId).get();

      if (!doc.exists) return [];

      const data = doc.data();
      return [{
        id: doc.id,
        name: data?.name || 'Chưa rõ tên',
        image: { uri: data?.image || '' },
        description: data?.description || 'Không có mô tả',
        tags: data?.tags || [],
        location: data?.location || 'Không xác định',
        price: data?.price || 0,
        latitude: data?.latitude,
        longitude: data?.longitude
      }];
    }

    // Nếu không có hotelId, lọc theo điều kiện khác
    let query = firestore().collection('datahotel');

    if (filter?.minPrice !== undefined) {
      query = query.where('price', '>', filter.minPrice);
    }
    if (filter?.userId !== undefined) {
      query = query.where('userId', '==', filter.userId);
    }
    if (filter?.featuredHotels !== undefined) {
      query = query.where('featuredHotels', '==', filter.featuredHotels);
    }
    if (filter?.location) {
      query = query.where('location', '==', filter.location);
    }

    const snapshot = await query.get();

    const list = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || 'Chưa rõ tên',
        image: { uri: data.image || '' },
        description: data.description || 'Không có mô tả',
        tags: data.tags || [],
        location: data.location || 'Không xác định',
        price: data.price || 0,
        latitude: data.latitude,
        longitude: data.longitude
      };
    });

    return list;
  } catch (err) {
    console.error('Lỗi khi lấy danh sách khách sạn:', err);
    return [];
  }
};



// lấy dữ liệu của comment
export const fetchComments = async (hotelId: string) => {
  try {
    // 1. Lấy tất cả comment
    const snapshot = await firestore()
      .collection('datahotel')
      .doc(hotelId)
      .collection('comments')
      .get();

    const commentDocs = snapshot.docs;
    if (commentDocs.length === 0) return [];

    // 2. Lấy tất cả userId duy nhất
    const userIds = Array.from(
      new Set(commentDocs.map(doc => doc.data().userId).filter(Boolean))
    );

    // 3. Lấy tất cả users tương ứng
    let userMap = new Map<string, string>();
    if (userIds.length > 0) {
      const usersSnapshot = await firestore()
        .collection('users')
        .where(firestore.FieldPath.documentId(), 'in', userIds.slice(0, 10)) // Firestore giới hạn 'in' là 10 phần tử
        .get();

      usersSnapshot.forEach(userDoc => {
        const userData = userDoc.data();
        userMap.set(userDoc.id, userData?.username || 'Ẩn danh');
      });
    }

    // 4. Trả về mảng comment đã map với tên người dùng
    const commentsWithUser = commentDocs.map(doc => {
      const data = doc.data();
      const username = userMap.get(data.userId) || 'Ẩn danh';

      return {
        id: doc.id,
        user: username,
        content: Array.isArray(data.comment) ? data.comment[0] : data.comment || '',
        rating: data.rating || 0,
      };
    });

    return commentsWithUser;
  } catch (error) {
    console.error(`Lỗi khi lấy bình luận cho khách sạn ${hotelId}:`, error);
    return [];
  }
};


// lấy data menities
// Lấy data amenities từ Firestore
export const fetchAmenities = async (hotelId: string) => {
  const snapshot = await firestore()
    .collection('datahotel')
    .doc(hotelId)
    .collection('amenities')
    .get();

  const amenities = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  return amenities;
};
// thêm coment
export const addCommentToHotel = async ({
  hotelId,
  userId,
  comment,
  rating = 5,
}: AddCommentInput): Promise<boolean> => {
  try {
    if (!hotelId || !userId || !comment.trim()) return false;
    const commentData = {
      userId,
      comment: comment.trim(),
      rating,
    };

    await firestore()
      .collection('datahotel')
      .doc(hotelId)
      .collection('comments')
      .add(commentData);

    return true;
  } catch (error) {
    console.error('❌ Lỗi khi thêm bình luận:', error);
    return false;
  }
};


// lấy dữ liệu khi tìm khách sạn
export const fetchDataHotelsFind = async (filter?: findHotelFilter) => {
  try {
    let query = firestore().collection('datahotel');

    // Áp dụng các bộ lọc nếu có
    if (filter?.location !== undefined) {
      query = query.where('location', '==', filter.location);
    }

    if (filter?.classify !== undefined) {
      query = query.where('classify', '==', filter.classify);
    }

    const snapshot = await query.get();

    const list = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || 'Chưa rõ tên',
        image: { uri: data.image || '' },
        description: data.description || 'Không có mô tả',
        tags: data.tags || [],
        location: data.location || 'Không xác định',
        price: data.price || 0,
        latitude: data.latitude,
        longitude: data.longitude,
        classify: data.classify,
        originalPrice: data.originalPrice,
        breakfast:data.breakfast,
        freeCancel: data.freeCancel,
          payLater: data.payLater,
        ranking: data.ranking,
        reviewsCount : data.reviewsCount,
        review: data.review,
        address: data.address
      };
    });

    return list;
  } catch (err) {
    console.error('Lỗi khi lấy danh sách khách sạn:', err);
    return [];
  }
};

// lấy danh sách trong booking
export const fetchBookings = async () => {
  try {
    const user = auth().currentUser;
    if (!user) {
      throw new Error('Người dùng chưa đăng nhập');
    }

    const userId = user.uid;

    // Truy vấn các bookings mà userId khớp với người dùng hiện tại
    const snapshot = await firestore()
      .collection('bookings')
      .where('userId', '==', userId)
      .get();

    const list = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        status: data.status,
        hotelId: data.hotelId,
        // thêm các trường khác nếu cần, ví dụ:
        // checkIn: data.checkIn,
        // checkOut: data.checkOut,
      };
    });

    return list;
  } catch (err) {
    console.error('Lỗi khi lấy danh sách bookings theo người dùng:', err);
    return [];
  }
};

