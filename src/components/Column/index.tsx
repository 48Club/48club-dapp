import styled from 'styled-components'

export const Column = styled.div<{
  gap?: string
  width?: string
  height?: string
  align?: string
  justify?: string
  mt?: string
  ml?: string
  mr?: string
}>`
  margin-top: ${({ mt }) => mt ?? '0'};
  margin-left: ${({ ml }) => ml ?? '0'};
  margin-right: ${({ mr }) => mr ?? '0'};
  width: ${({ width }) => width ?? 'auto'};
  height: ${({ height }) => height ?? 'auto'};
  display: flex;
  flex-direction: column;
  align-items: ${({ align }) => align ?? 'center'};
  justify-content: ${({ justify }) => justify ?? 'flex-start'};
  gap: ${({ gap }) => gap};
`
export const ColumnCenter = styled(Column)`
  width: 100%;
  align-items: center;
`

export const AutoColumn = styled.div<{
  gap?: string
  justify?: 'stretch' | 'center' | 'start' | 'end' | 'flex-start' | 'flex-end' | 'space-between'
  grow?: true
  width?: string
}>`
  width: ${({ width }) => (width ? width : 'auto')};
  display: grid;
  grid-auto-rows: auto;
  grid-row-gap: ${({ gap }) => gap};
  justify-items: ${({ justify }) => justify && justify};
  flex-grow: ${({ grow }) => grow && 1};
`

export default Column
