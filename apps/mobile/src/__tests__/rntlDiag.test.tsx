import React from 'react';
import { Text, View } from 'react-native';
import { render } from '@testing-library/react-native';

describe('RNTL render diagnostic', () => {
  it('render (awaited) returns an object with getByText', async () => {
    const result = await render(
      <View>
        <Text>hello world</Text>
      </View>
    );
    expect(typeof result.getByText).toBe('function');
    expect(result.getByText('hello world')).toBeTruthy();
  });
});
