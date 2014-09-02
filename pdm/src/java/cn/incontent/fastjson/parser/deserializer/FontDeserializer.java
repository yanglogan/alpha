package cn.incontent.fastjson.parser.deserializer;

import java.awt.Font;
import java.lang.reflect.Type;
import java.util.Collections;
import java.util.Set;

import cn.incontent.fastjson.JSONException;
import cn.incontent.fastjson.parser.DefaultJSONParser;
import cn.incontent.fastjson.parser.JSONScanner;
import cn.incontent.fastjson.parser.JSONToken;

public class FontDeserializer implements AutowiredObjectDeserializer {

    public final static FontDeserializer instance = new FontDeserializer();

    @SuppressWarnings("unchecked")
    public <T> T deserialze(DefaultJSONParser parser, Type type, Object fieldName) {
        JSONScanner lexer = (JSONScanner) parser.getLexer();
        
        if (lexer.token() == JSONToken.NULL) {
            lexer.nextToken(JSONToken.COMMA);
            return null;
        }

        if (lexer.token() != JSONToken.LBRACE && lexer.token() != JSONToken.COMMA) {
            throw new JSONException("syntax error");
        }
        lexer.nextToken();

        int size = 0, style = 0;
        String name = null;
        for (;;) {
            if (lexer.token() == JSONToken.RBRACE) {
                lexer.nextToken();
                break;
            }

            String key;
            if (lexer.token() == JSONToken.LITERAL_STRING) {
                key = lexer.stringVal();
                lexer.nextTokenWithColon(JSONToken.LITERAL_INT);
            } else {
                throw new JSONException("syntax error");
            }


            if (key.equalsIgnoreCase("name")) {
                if (lexer.token() == JSONToken.LITERAL_STRING) {
                    name = lexer.stringVal();
                    lexer.nextToken();
                } else {
                    throw new JSONException("syntax error");
                }
            } else if (key.equalsIgnoreCase("style")) {
                if (lexer.token() == JSONToken.LITERAL_INT) {
                    style = lexer.intValue();
                    lexer.nextToken();
                } else {
                    throw new JSONException("syntax error");
                }
            } else if (key.equalsIgnoreCase("size")) {
                if (lexer.token() == JSONToken.LITERAL_INT) {
                    size = lexer.intValue();
                    lexer.nextToken();
                } else {
                    throw new JSONException("syntax error");
                }
            } else {
                throw new JSONException("syntax error, " + key);
            }

            if (lexer.token() == JSONToken.COMMA) {
                lexer.nextToken(JSONToken.LITERAL_STRING);
            }
        }

        return (T) new Font(name, style, size);
    }

    public int getFastMatchToken() {
        return JSONToken.LBRACE;
    }

    public Set<Type> getAutowiredFor() {
        return Collections.<Type>singleton(Font.class);
    }
}
