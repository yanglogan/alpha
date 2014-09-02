package cn.incontent.fastjson.parser.deserializer;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Map;

import cn.incontent.fastjson.parser.DefaultJSONParser;
import cn.incontent.fastjson.parser.JSONLexer;
import cn.incontent.fastjson.parser.JSONToken;
import cn.incontent.fastjson.parser.ParserConfig;
import cn.incontent.fastjson.util.FieldInfo;

public class ArrayListStringFieldDeserializer extends FieldDeserializer {

    public ArrayListStringFieldDeserializer(ParserConfig mapping, Class<?> clazz, FieldInfo fieldInfo){
        super(clazz, fieldInfo);

    }

    public int getFastMatchToken() {
        return JSONToken.LBRACKET;
    }

    @Override
    public void parseField(DefaultJSONParser parser, Object object, Type objectType, Map<String, Object> fieldValues) {
        ArrayList<Object> list;

        final JSONLexer lexer = parser.getLexer();
        if (lexer.token() == JSONToken.NULL) {
            lexer.nextToken(JSONToken.COMMA);
            list = null;
        } else {
            list = new ArrayList<Object>();

            ArrayListStringDeserializer.parseArray(parser, list);
        }
        if (object == null) {
            fieldValues.put(fieldInfo.getName(), list);
        } else {
            setValue(object, list);
        }
    }
}
