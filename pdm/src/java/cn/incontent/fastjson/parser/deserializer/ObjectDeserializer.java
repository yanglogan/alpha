package cn.incontent.fastjson.parser.deserializer;

import java.lang.reflect.Type;

import cn.incontent.fastjson.parser.DefaultJSONParser;

public interface ObjectDeserializer {
    <T> T deserialze(DefaultJSONParser parser, Type type, Object fieldName);
    
    int getFastMatchToken();
}
