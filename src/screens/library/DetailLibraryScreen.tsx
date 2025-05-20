import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  ImageSourcePropType,
  Pressable,
} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_MARGIN = 16;
const CARD_WIDTH = SCREEN_WIDTH - CARD_MARGIN * 2;
const CARD_HEIGHT = 220;

type ImageType = ImageSourcePropType & {
  uri: string;
  name?: string;
  price?: string;
};

type Collection = {
  id: string;
  title: string;
  count: number;
  time: string;
  images: ImageType[];
};

type RouteParams = {
  CollectionDetail: {
    collection: Collection;
  };
};

export default function DetailLibraryScreen() {
  const route = useRoute<RouteProp<RouteParams, 'CollectionDetail'>>();
  const {collection} = route.params;

  const imagesToShow =
    collection.images.length > 0
      ? collection.images
      : [
          {
            uri: 'https://i.pinimg.com/736x/b8/8d/cf/b88dcf58674caa517a052206c866225d.jpg',
            name: 'Ảnh mặc định',
            price: '₫0',
          },
        ];

  const renderItem = ({item}: {item: ImageType}) => {
    return (
      <Pressable
        style={({pressed}) => [styles.card, pressed && styles.cardPressed]}
        android_ripple={{color: '#d1f0e7'}}
        onPress={() => {
          // TODO: handle item press
          console.log('Pressed:', item.name);
        }}>
        <Image
          source={{uri: item.uri}}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">
            {item.name || 'Tên khách sạn'}
          </Text>
          <View style={styles.priceWrapper}>
            <Text style={styles.price}>{item.price || '₫0'}</Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{collection.title}</Text>
      <Text style={styles.subText}>
        {collection.count} Ghim · {collection.time}
      </Text>

      <FlatList
        data={imagesToShow}
        numColumns={1}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingVertical: 16,
          paddingHorizontal: CARD_MARGIN,
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
    paddingHorizontal: CARD_MARGIN,
  },
  subText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
    paddingHorizontal: CARD_MARGIN,
  },
  card: {
    width: CARD_WIDTH,
    marginBottom: 18,
    borderRadius: 16,
    backgroundColor: '#fff',
    overflow: 'hidden',

    // shadow iOS
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 6},

    // elevation Android
    elevation: 6,

    transform: [{scale: 1}],
  },
  cardPressed: {
    transform: [{scale: 0.97}],
    shadowOpacity: 0.2,
    elevation: 10,
  },
  image: {
    width: '100%',
    height: CARD_HEIGHT,
  },
  info: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 26,
  },
  priceWrapper: {
    marginTop: 8,
    backgroundColor: '#D1FAE5',
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
  },
});
